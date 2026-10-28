# Launch checklist

The manual steps to take FE Grind live. Everything that can be automated already is. What is left are
account and settings tasks that only the repository owner can do. Work top to bottom.

**How it fits together**

| Piece                                           | Does                                                                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub Actions** (`.github/workflows/ci.yml`) | On every push and PR: typecheck, ESLint, Stylelint, Prettier, WCAG contrast, tests + coverage gate, full prerender build, SonarCloud scan |
| **Vercel** (Git integration, `vercel.json`)     | Builds and deploys: production from `main`, a preview URL for every PR                                                                    |
| **Branch protection**                           | Only lets a PR merge into `main` once `verify` passes, so failing code never reaches production                                           |
| **Husky** (local)                               | `pre-commit` (file-size limit, lint and format staged files), `commit-msg` (Conventional Commits), `pre-push` (typecheck and tests)       |

Live site: `https://front-end-grind.vercel.app/` · Repository: `github.com/Divalsehgal/front-end-questions`

---

## 1. Vercel project settings (one time, about 5 minutes)

The project already exists and is connected to the repository. In the Vercel dashboard → the project:

- [ ] **Settings → Git:** Production Branch is **`main`**. Previews for other branches and PRs are on by default.
- [ ] **Settings → Build and Deployment:** leave everything on "use `vercel.json`". It sets framework Vite, build
      command `npm run build` and output directory `dist`, so don't override them in the UI.
- [ ] **Settings → Environment Variables** (Production and Preview). Add each one when you need it:
  - `GOOGLE_SITE_VERIFICATION`: the code from Search Console (step 4). The build adds the meta tag to every page.
  - `SITE_URL`: only for a custom domain, for example `https://fegrind.dev/`. Without it, the build uses
    `https://front-end-grind.vercel.app/`.
- [ ] Optional: **Settings → Deployment Protection:** keep Vercel Authentication for **preview** deployments only,
      never production. Previews also send `X-Robots-Tag: noindex`, so Google won't index them.

## 2. GitHub repository settings (one time, about 5 minutes)

`github.com/Divalsehgal/front-end-questions` → **Settings**:

- [ ] **Pages:** set Source to **None** (unpublish). The old GitHub Pages copy at `divalsehgal.github.io` would
      compete with Vercel in search. Then delete the stale `gh-pages` branch.
- [ ] **Secrets and variables → Actions → Secrets:** add `SONAR_TOKEN` (from step 3).
- [ ] **Rules → Rulesets → New branch ruleset** for `main`: require a pull request, and require the status checks
      **`verify`** and **Vercel**. The checks only appear in the list after they have run once.
- [ ] **Code security:** turn on Dependabot alerts and security updates.
- [ ] Repository home page → **About** (gear icon): set **Website** to the live URL and add topics such as
      `interview-preparation`, `javascript`, `react`, `typescript`. This gives the site its first backlink.

## 3. SonarCloud (one time, about 10 minutes)

`sonar-project.properties` is already configured: `organization=divalsehgal`,
`projectKey=Divalsehgal_front-end-questions`.

- [ ] Sign in at [sonarcloud.io](https://sonarcloud.io) with GitHub. Create or import the organization **divalsehgal**.
      Its key must match `sonar.organization`.
- [ ] **Analyze new project** → `Divalsehgal/front-end-questions`. Make sure the project key is
      `Divalsehgal_front-end-questions`. If SonarCloud suggests a different key, change the properties file instead.
- [ ] Project **Administration → Analysis Method:** turn **off** Automatic Analysis. CI runs the scan and uploads
      coverage, and the two modes conflict.
- [ ] **My Account → Security → Generate token**, then save it as the `SONAR_TOKEN` repository secret (step 2).
- [ ] Project **Administration → New Code:** choose "Previous version" or "Number of days: 30".
- [ ] Keep the **Sonar way** quality gate. Re-run CI (Actions → CI → Run workflow) and check that the dashboard shows
      about 99% coverage. If it shows 0%, the `coverage/lcov.info` path is wrong.
- [ ] Optional: add the Quality Gate and Coverage badges (Project → Information) to `README.md`.

## 4. First production deploy

- [ ] Open a PR from `feat/grind-app` into `main`. Wait for **verify** and the **Vercel preview**, then click the
      preview link and check a few pages.
- [ ] Merge. Vercel deploys production. Then check on `https://front-end-grind.vercel.app/`:
  - pages are styled and interactive, and the browser console has no 404s
  - a deep link such as `/q/react/h-17/` loads directly, and refreshing it works
  - `/review/`, `/mock/` and `/session/` load (rewritten to the app shell)
  - `/sitemap.xml` and `/robots.txt` load, and their URLs start with the Vercel address
  - a nonsense URL such as `/nope/` returns a real 404
- [ ] Once production is live, delete the old `tsPractice` and `datatable-ts` repositories. Their content is now in
      the TypeScript and Machine Coding subjects.

## 5. SEO (after the first production deploy)

The site is already built for search: every question is a static page with its own title, description, canonical
URL, Open Graph image and JSON-LD, and the sitemap is generated from the question registry. On Vercel the site sits
at the domain root, so `robots.txt` works too. What is left is telling search engines the site exists.

- [ ] [Google Search Console](https://search.google.com/search-console) → **Add property → URL prefix** →
      `https://front-end-grind.vercel.app/`.
- [ ] Choose **HTML tag** verification. Copy only the `content="…"` value into the `GOOGLE_SITE_VERIFICATION` Vercel
      environment variable, then redeploy (Deployments → ⋯ → Redeploy). When the deploy finishes, click **Verify**.
- [ ] **Sitemaps:** submit `sitemap.xml`. It is a sitemap index of 14 per-subject sitemaps, about 540 URLs.
- [ ] **URL inspection:** inspect the home page and 3–5 strong question pages, then click **Request indexing** on
      each. There is a small daily quota, so don't submit every page.
- [ ] [Bing Webmaster Tools](https://www.bing.com/webmasters): **Import from Google Search Console**. This also
      covers DuckDuckGo and Yahoo.
- [ ] Spot-check a question page with the [Rich Results Test](https://search.google.com/test/rich-results) and
      [PageSpeed Insights](https://pagespeed.web.dev/). Expected: valid structured data, mobile performance 95 or more.
- [ ] Get backlinks, the main remaining ranking factor: link the site from your GitHub profile README, LinkedIn and
      a dev.to or Hashnode post, and share specific question pages where people ask about them.
- [ ] Check back after 1–2 weeks: **Pages** (indexed vs not indexed, with reasons) and **Performance** (the queries
      you already appear for).

### Optional: custom domain (recommended for ranking and sharing)

A short domain such as `fegrind.dev` ranks and shares better than `*.vercel.app`.

- [ ] Buy the domain, then in Vercel go to **Settings → Domains → Add** and follow the DNS records it shows (an `A`
      record for the apex, a `CNAME` for `www`). Set the apex as primary and redirect `www` to it. HTTPS is automatic.
- [ ] Set the `SITE_URL` Vercel environment variable to `https://<domain>/` and redeploy, so canonical URLs, the
      sitemap and Open Graph tags use the new domain. Then change `DEFAULT_SITE_URL` in `vite.config.ts` to match.
- [ ] In Search Console, add a **Domain** property for the new domain and submit its sitemap. Keep the
      `vercel.app` property for a while; Vercel redirects nothing by itself, but the canonical tags tell Google which
      URL to prefer.

## 6. Adding content later

Nothing to do by hand. Add questions under `src/content/subjects/` and open a PR. Each question gets its own
prerendered page, meta tags, structured data and sitemap entry. The build fails on duplicate question ids, and the
content gate fails if a reference solution doesn't pass its tests.
