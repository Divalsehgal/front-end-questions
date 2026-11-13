# Analytics: GTM → GA4

The app pushes events to `window.dataLayer` (see `apps/web/src/analytics.ts`). GTM forwards them to GA4. GTM is loaded
only when `NEXT_PUBLIC_GTM_ID` is set at build time.

## Status (Nov 13, 2026)

| Piece                                       | ID / where                                                                     | State                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| GTM container                               | `GTM-W4MN9VC6`                                                                 | Version 2 published                                                                    |
| GA4 property                                | "FE Grind", Measurement ID `G-72088HPR4D`                                      | Receiving production hits                                                              |
| Vercel env                                  | `NEXT_PUBLIC_GTM_ID` on Production and Preview                                 | Set; production deployed from `main`                                                   |
| Custom dimensions                           | `subject`, `session_type`, `correct`, `first_attempt`, `passed`, `search_term` | Created (event scope)                                                                  |
| Custom metrics                              | `question_count`, `answered`                                                   | Created (Standard unit)                                                                |
| Key event                                   | `session_end`                                                                  | **To do:** star it in Admin → Events once it appears (up to 24 h after the first hits) |
| Internal-traffic filter, 14-month retention | GA4 Admin                                                                      | Not checked; do if missing                                                             |
| Consent banner                              | GTM Consent Mode v2                                                            | Not built; needed before ads                                                           |

## Events

| Event               | Params                                                  | Fired from                         |
| ------------------- | ------------------------------------------------------- | ---------------------------------- |
| `page_view`         | sent by GA4 enhanced measurement, not by the app        | —                                  |
| `question_answered` | `question_key`, `subject`, `correct`, `first_attempt`   | `state/progress.ts` `record()`     |
| `code_run`          | `question_id`, `passed`                                 | `questions/CodeView/useCodeRun.ts` |
| `search`            | `search_term`, `question_key`                           | `shell/Layout/Search.tsx`          |
| `session_start`     | `session_type`, `question_count`                        | `state/session.ts` `startSession`  |
| `session_end`       | `session_type`, `question_count`, `answered`, `correct` | `state/session.ts` `endSession`    |

`correct` is a boolean on `question_answered` and a count on `session_end`. That works in GA4, but the `correct`
dimension will show both kinds of value.

## How the code works

- `analytics.ts` holds `GTM_ID`, a typed `Events` map, `track(event, params)` and `GTM_SCRIPT`. `track` is a no-op on
  the server and when `GTM_ID` is empty.
- `app/layout.tsx` renders `GTM_SCRIPT` in `<head>` when `GTM_ID` is set.
- **No `page_view` from the app.** Enhanced measurement's history-change option records client-side route changes.
  Pushing one too would double-count.
- **Stale params.** GTM's data model keeps every key ever pushed, so a `search_term` would ride along on later
  events. `track` remembers the keys it has pushed and sends `undefined` for any key the current event doesn't
  have. `analytics.test.ts` covers this.
- **Turbo.** `turbo.json`'s `build` task lists `NEXT_PUBLIC_GTM_ID` in `env`. Strict env mode drops unlisted vars, so
  without it production builds silently ship with no GTM.
- **Adding an event:**
  1. Add it to `Events` and call `track`.
  2. Add its name to the GTM trigger regex.
  3. Add a `dlv - <param>` variable and a param row on the GA4 tag for any new param.
  4. Add a custom dimension or metric in GA4.
  5. Publish GTM.

## Setup from scratch

### 1. GA4

1. analytics.google.com → Admin → Create → Property. Set the time zone and currency.
2. Data streams → Add stream → Web, using the production URL. Copy the **Measurement ID** (`G-…`).
3. In the stream, turn on Enhanced measurement. In its gear, tick **Page changes based on browser history events** and
   untick **Site search** (the app sends its own `search` event).
4. Admin → Data retention → **14 months**.
5. Admin → Data filters → Internal traffic filter in _Testing_. In the stream's Configure tag settings → Define
   internal traffic, add your IP.

### 2. GTM

1. tagmanager.google.com → container, target **Web**. Ignore the install snippet; the app already has it.
2. **Variables** → Data Layer Variable (version 2), one per param, named `dlv - <param>`.
3. **Trigger** `CE - app events`: Custom Event, regex
   `^(question_answered|code_run|search|session_start|session_end)$`.
4. **Tags**:
   - `GA4 - config`: Google Tag with the `G-…` id, trigger **Initialization – All Pages**.
   - `GA4 - app events`: GA4 Event, Measurement ID `G-…`, event name `{{Event}}` (enable the built-in Event variable),
     one param row per `{{dlv - <param>}}`, trigger `CE - app events`. GA4 drops empty params, so one tag covers every
     event.

### 3. Vercel

Settings → Environment Variables → add `NEXT_PUBLIC_GTM_ID = GTM-…` to Production and Preview. The value is inlined at
build time, so **redeploy** afterwards.

### 4. Verify and publish

1. On the deployed site:
   - `dataLayer.map(e => e.event)` starts with `gtm.js`, `gtm.dom`, `gtm.load`.
   - `googletagmanager.com/gtm.js?id=GTM-…` returns 200.
2. GTM **Preview**: do each action (search, answer, run tests, start and finish a Review round) and check that
   `GA4 - app events` fires with the right params.
3. **Submit → Publish**.
4. On production, check the network requests to `google-analytics.com/g/collect`. `en=` is the event name and `ep.*`
   holds the params. Check that each hit carries only its own params. Then check GA4 → Reports → Realtime.

### 5. Right after publishing (day 1: custom definitions are not retroactive)

1. Admin → Custom definitions → custom dimensions (Event scope) for the string and boolean params, and custom metrics
   (Standard unit) for the counts.
2. Admin → Events → star `session_end` as a key event. The star exists only once the event appears in that list, up to
   24 h later. There is no way to add it by name.
3. After 24–48 h:
   - Reports → Engagement → Events lists every event.
   - Switch the internal-traffic filter from Testing to Active.

## Search Console

- **Property.** URL-prefix property `https://front-end-grind.vercel.app/`, already verified by an **HTML file**.
- **GTM as a second ownership method.** Search Console → Settings → Ownership verification → Google Tag Manager →
  Verify. It needs:
  - the `<noscript>` iframe from the container snippet in `<body>` (`app/layout.tsx` renders it);
  - "Publish" permission on the container.
    If the HTML file is ever removed, ownership survives.
- **GA4 link.** GA4 Admin → Product links → Search Console links → Link, then pick the property and the web stream.
  Reports → Search Console then shows queries and landing pages, after up to 48 h.
- **Sitemap.** Search Console → Sitemaps → `sitemap.xml`.
- **Meta tag (optional).** The `GOOGLE_SITE_VERIFICATION` env var renders a meta tag, but it isn't set on Vercel; GTM
  covers it.

## Troubleshooting

| Symptom                                  | Likely cause                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| No `gtm.js` request                      | Env var missing in that Vercel environment, deploy predates it, or not in `turbo.json` `env`      |
| GTM loads, GA4 shows nothing             | Container not published, or an ad blocker (test in a clean profile)                               |
| Old container still served after publish | `gtm.js` is cached for 15 min; wait, or `fetch(url, { cache: 'reload' })`                         |
| Params from another event on a hit       | Stale data-model keys; `track` must clear them (see above)                                        |
| Only first page view counted             | History-change option off in enhanced measurement                                                 |
| Duplicate page views                     | A second config tag, the Google tag also firing on History Change, or the app pushing `page_view` |
| Event shows, params missing in reports   | Custom dimension not created, or created after the event (not retroactive)                        |
| GSC "could not find a GTM container ID"  | The `<noscript>` iframe is missing from `<body>`, or the deploy with it is not live yet           |
| Can't mark an event as key               | It hasn't appeared in Admin → Events yet; wait up to 24 h                                         |

## Notes for doing the console work with Claude's browser pane

- **Tag Assistant:**
  - The pane blocks the Tag Assistant popup and can't drive it, and navigation pauses while it is open. The user has
    to click through it.
  - Tag Assistant may debug the Live version, not the draft. Publishing and checking `/g/collect` hits on production
    was simpler.
- **Side panels in GA4 and GTM:** Escape closes the panel (losing the input) or raises "unsaved changes". Click another
  field to move focus instead.
- **GTM autocomplete:** typing `{{` can append junk (`G-XXXX{{Event}}`). Zoom-screenshot the field before saving.
- **Click coordinates:** after the pane resizes, `ref_N` clicks can land in a stale coordinate frame. Take a screenshot
  and click by coordinates, and confirm each save by reading the list afterwards.
- **GA4 custom metrics:** Save stays disabled until a unit (Standard) is picked.
- **Dimension names:** GA4 fills an empty dimension name from the parameter (e.g. `session_type`).
- **Sign-in:** the user signs in to Google and Vercel themselves.

## Before ads: consent

AdSense (and GA4 for EU/UK visitors) needs a cookie-consent banner wired to GTM Consent Mode v2 before going live.

Monetization options, roughly in order of fit for a developer audience:

- Carbon Ads or EthicalAds;
- sponsorships;
- affiliate links to courses or books;
- a paid tier (more drills, mock interviews);
- AdSense last (low RPM, needs consent and traffic).

## Reusing this on another project

Paste this into a new session, with the placeholders filled in:

> Add GTM → GA4 analytics to this Next.js app following `docs/analytics-setup.md` from the FE Grind repo (copy its
> "How the code works" design, including stale-param clearing and the turbo `env` entry). Pick a bare-minimum event
> set from the app's real user actions. Then set up GA4, GTM and Vercel in the browser pane per "Setup from scratch",
> verify on production through `/g/collect` hits, and create the custom definitions on day 1. I sign in myself.
> Site: `<URL>`. GTM: `<GTM-… or create>`. GA4: `<existing account / new property>`.
