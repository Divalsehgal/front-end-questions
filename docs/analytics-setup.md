# Analytics setup: GTM → GA4

The app pushes events to `window.dataLayer` (see `apps/web/src/analytics.ts`). It loads GTM only when
`NEXT_PUBLIC_GTM_ID` is set at build time. Everything below happens in the Google and Vercel consoles; no code changes.

| Event               | Params                                                  |
| ------------------- | ------------------------------------------------------- |
| `page_view`         | sent by GA4 enhanced measurement, not by the app        |
| `question_answered` | `question_key`, `subject`, `correct`, `first_attempt`   |
| `code_run`          | `question_id`, `passed`                                 |
| `search`            | `search_term`, `question_key`                           |
| `session_start`     | `session_type`, `question_count`                        |
| `session_end`       | `session_type`, `question_count`, `answered`, `correct` |

## 1. GA4 property

1. analytics.google.com → Admin → Create → Property. Name it "FE Grind", set your time zone and currency.
2. Data streams → Add stream → Web. URL: `https://front-end-grind.vercel.app`. Copy the **Measurement ID** (`G-…`).
3. In that stream → Enhanced measurement: on. Open its gear and make sure **Page changes based on browser history
   events** is ticked (this is what records page views for client-side navigation). Untick **Site search**: the app
   sends its own `search` event.
4. Admin → Data retention → set event data retention to **14 months** (default is 2).
5. Admin → Data filters → add an **Internal traffic** filter in _Testing_ state, plus Data streams → Configure tag
   settings → Define internal traffic with your own IP, so your visits can be excluded later.

## 2. GTM container

1. tagmanager.google.com → Create account → container "FE Grind", target platform **Web**. Copy the **Container ID**
   (`GTM-…`). Ignore the install snippet: the app already has it.
2. **Variables** → User-Defined → New → _Data Layer Variable_ (version 2), one per param, named `dlv - <param>`:
   `question_key`, `question_id`, `subject`, `correct`, `first_attempt`, `passed`, `search_term`, `session_type`,
   `question_count`, `answered`.
   (The `correct` variable is shared by `question_answered` and `session_end`: a boolean for one, a count for the
   other. Fine for GA4.)
3. **Triggers** → New → _Custom Event_, name `CE - app events`, event name
   `^(question_answered|code_run|search|session_start|session_end)$`, tick **Use regex matching**.
4. **Tags**:
   - _Google Tag_: tag ID = your `G-…`, trigger **Initialization – All Pages**. Name `GA4 - config`.
   - _Google Analytics: GA4 Event_: Measurement ID `G-…`, Event name `{{Event}}` (enable the built-in _Event_
     variable if it is not listed), Event parameters: one row per param above → `{{dlv - <param>}}`. Trigger
     `CE - app events`. Name `GA4 - app events`.
     Empty params (a param that event does not send) are dropped by GA4, so one tag covers all five events.
5. Do **not** publish yet. Verify first (section 4).

## 3. Vercel env var

1. Vercel → project → Settings → Environment Variables → add `NEXT_PUBLIC_GTM_ID = GTM-…`.
   - Tick **Production** and **Preview**. It is inlined at build time, so it needs a redeploy to take effect.
   - Optional: use a second GTM _environment_ for Preview so test traffic never hits prod numbers. Simpler: rely on
     the internal-traffic filter from step 1.5.
2. Redeploy the `feat/nextjs-migration` preview (Deployments → ⋯ → Redeploy). Production picks it up once the branch
   is merged to `main`.

## 4. Verify (before publishing GTM)

On the preview deployment:

1. **Snippet is on the page.** DevTools console: `dataLayer.map(e => e.event)` → starts with `gtm.js`, `gtm.dom`,
   `gtm.load`. Network tab: a request to `googletagmanager.com/gtm.js?id=GTM-…` returns 200.
2. **GTM Preview.** In GTM click **Preview**, enter the preview URL. In the Tag Assistant tab, do each action and
   check that `GA4 - app events` shows under _Tags Fired_ with the right params:
   - search (Cmd/Ctrl+K, type, Enter) → `search`
   - answer any quiz question → `question_answered`
   - run tests on a code drill → `code_run`
   - Review → start a round → `session_start`; finish it and click Done → `session_end`
   - change page → `GA4 - config` fired once, and a `page_view` appears in GA4 (next step), not as a GTM event.
3. **GA4 DebugView.** GA4 → Admin → DebugView (Preview mode tags the session as debug). Each event and its params
   appear within seconds. `page_view` should appear on every route change, not only the first load.
4. If all good: GTM → **Submit** → version name "Initial GA4 events" → **Publish**.

## 5. After publishing

1. GA4 → Reports → **Realtime**: open the production site in a normal window (no Preview) and see yourself plus
   `question_answered` etc. within a minute.
2. GA4 → Admin → Custom definitions → **Create custom dimension** (scope _Event_) for `subject`, `session_type`,
   `correct`, `first_attempt`, `passed`, `search_term`; **custom metric** for `question_count`, `answered`. Without
   this, params are collected but never show in standard reports. Dimensions are not retroactive, so do it on day 1.
3. Admin → Events → toggle **Mark as key event** on `session_end` (finished a round) and optionally
   `question_answered`.
4. 24–48 h later: Reports → Engagement → Events should list all five events with counts. Activate the internal-traffic
   filter (Testing → Active) once you have confirmed your own traffic is tagged.

## Troubleshooting

| Symptom                                | Likely cause                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| No `gtm.js` request                    | Env var missing in that Vercel environment, or deploy happened before it was set |
| GTM loads, GA4 shows nothing           | GTM container not published, or ad blocker (test in a clean profile)             |
| Only first page view counted           | History-change option off in enhanced measurement                                |
| Event shows, params missing in reports | Custom dimension not created, or created after the event (not retroactive)       |
| Duplicate page views                   | A second GA4 config tag, or the Google tag also set to fire on History Change    |

## Later: consent

Ads (and GA4 for EU/UK visitors) need a cookie-consent banner with GTM Consent Mode v2 before going live with
AdSense. Not set up yet.
