# SEO Audit: front-end-grind.vercel.app

Date: 2026-10-31 · Pages crawled: 578 of 578 (every URL in the sitemap index) · Business type: free education / developer-learning site (no local or e-commerce signals)

## Executive summary

**SEO Health Score: 87 / 100**

The site is technically very strong. Every page is prerendered HTML with a unique title, a description, a self-canonical tag, one H1 and valid JSON-LD. Lighthouse SEO, accessibility and best-practices all score 100.

The site doesn't rank for "front end grind" because of **brand and authority** problems, not technical ones:

1. The site calls itself "FE Grind", but people search "front end grind". The live title and H1 never contain that phrase, so Google falls back to the domain (hence searching "vercel" works) and labels the result "Vercel".
2. It sits on a shared `*.vercel.app` subdomain and is new, with few or no links from other sites. Google gives a site like this little trust until other sites point at it.

### Top 5 issues

| #   | Issue                                                                                         | Severity |
| --- | --------------------------------------------------------------------------------------------- | -------- |
| 1   | Brand phrase "Front End Grind" is missing from the live title, H1, `og:site_name` and JSON-LD | High     |
| 2   | Few or no links from other sites; brand not tied to a profile Google trusts                   | High     |
| 3   | Shared `vercel.app` subdomain instead of a custom domain                                      | Medium   |
| 4   | 37 question pages under 200 words (min 175)                                                   | Medium   |
| 5   | 3 pairs of duplicate meta descriptions (React output questions)                               | Low      |

### Top 5 quick wins

1. Deploy the uncommitted title + `alternateName` change (already done locally, tests pass).
2. Put "Front End Grind" in the home H1 or the line under it, and in `og:site_name` / `manifest.name`.
3. Request indexing of `/` in Search Console and resubmit `sitemap.xml`.
4. Link the site from the GitHub repo "Website" field, your GitHub profile README, LinkedIn and dev.to/Hashnode posts, each with the anchor text "Front End Grind".
5. Make the 3 duplicate descriptions unique.

## Technical SEO: 95

**What works**

- All 578 sitemap URLs return 200 with no redirects, and each canonical matches its URL exactly.
- `robots.txt` allows everything except the 6 progress-only routes, which also carry `noindex`. It points to the sitemap index (14 child sitemaps).
- Unknown URLs return a real **404** with `noindex, follow` (after a 308 redirect that adds the trailing slash).
- HTTPS with HSTS preload, `nosniff`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` all set.
- Pages are prerendered, so crawlers get full content without running JavaScript.

**Findings**

- _Medium_: shared `vercel.app` host. It works, but a custom domain builds brand authority you own and survives a host change.
- _Low_: `/nope-xyz` → 308 → `/nope-xyz/` → 404. That's harmless; just noting the extra hop.

## Content quality: 75

**What works**

- Every question page has the question, answer and explanation in its HTML. The median page is 269 words; the longest is 3,072.
- Author is named (Dival Sehgal) and linked to GitHub on every page and in JSON-LD.

**Findings**

- _Medium_: 37 pages are under 200 words (e.g. `/q/typescript/rts-f2/` 175, `/q/javascript/el-f2/` 181). Flashcard-style answers are fine for users, but they compete weakly against long articles. Add an example or a "common mistake" line to the shortest ones.
- _Medium_: E-E-A-T is thin beyond the author's name. There's no About page saying who wrote the content and why to trust it (experience, role, review process).
- _Low_: 3 pairs of identical meta descriptions:
  - "After 5 seconds, what does the &lt;div&gt; show?" (Hooks: useState & useEffect)
  - "Clicking the counter button 3 times…" (Hooks: useRef, useMemo)
  - "After one click, what does the button show?" (Hooks: useReducer & useContext)

## On-page SEO: 85

**What works**

- 578/578 pages have a title of 60 characters or fewer, a description of 70–160 characters, and exactly one H1. No duplicate titles.
- The home page links to all 13 subject hubs, and subject hubs link to their questions.

**Findings**

- _High_: the live home title is "FE Grind — Free frontend interview questions & practice", and the H1 is "Frontend interview grind". Neither matches what people search. Fixed locally for the title; the H1 still needs it.
- _Low_: `og:site_name`, `og:image:alt`, the breadcrumb root name and `manifest.webmanifest` all say "FE Grind" only.

## Schema / structured data: 90

**What works**

- `WebSite` on home; `BreadcrumbList` on 577 pages; `Quiz` with `Question`/`Answer` on 338 pages; `LearningResource` on 226; `ItemList` on subject hubs. Author is a `Person` with `sameAs`.

**Findings**

- _Medium_: the live `WebSite` has no `alternateName`. Google uses `name` + `alternateName` to choose the site name shown in results, which is currently "Vercel". Fixed locally.
- _Low_: there's no `Organization` / logo entity. Optional for a personal project, but adding a `publisher` logo helps site-name and knowledge-panel signals.

## Performance: 93 (Lighthouse lab, mobile)

| Page                   | Perf | LCP   | CLS | TBT  | FCP   |
| ---------------------- | ---- | ----- | --- | ---- | ----- |
| `/`                    | 93   | 2.1 s | 0   | 0 ms | 1.8 s |
| `/q/javascript/el-f2/` | 96   | 2.3 s | 0   | 0 ms | 2.0 s |

- _Low_: ~35 KiB of unused JS in the main bundle; the question page also flags a little legacy JS. You couldn't feel either.
- Field data (CrUX) wasn't available: the PageSpeed API hit its daily quota, and a new site likely has no CrUX data yet anyway.

## Images: 100

- No `<img>` in page bodies; icons are inline SVG. The OG image is 1200×630 with alt text.

## AI search readiness: 90

**What works**

- `/llms.txt` and `/llms-full.txt` (726 KB of every question with its answer) are served, and `robots.txt` blocks no AI crawler.
- The answers sit in static HTML in short, self-contained passages that AI answers can quote easily.

**Findings**

- _Low_: `llms.txt` is titled "# FE Grind". Add "(Front End Grind)" so AI tools tie the spelled-out name to the site.

## Not covered

- Backlinks, GSC indexation, GA4 traffic: there are no API credentials, and the claude-seo runtime isn't set up (`/seo setup`).
- PageSpeed field data: API quota exhausted.
- Screenshots/visual checks: skipped, since Lighthouse accessibility scored 100 and layout shift is 0.
