# Launch checklist

The manual steps to take FE Grind live. Everything that can be automated already is. What is left are
account and settings tasks that only the repository owner can do. Work top to bottom; each section says when it is
done.

**How the pipeline works** (`.github/workflows/ci.yml`):

| Trigger               | `verify` job                                                                                         | `deploy` job                            |
| --------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Pull request          | typecheck, ESLint, Stylelint, Prettier, WCAG contrast, tests + coverage gate, full build, SonarCloud | skipped                                 |
| Push to `main`        | same                                                                                                 | publishes the exact `dist/` that passed |
| Manual (Run workflow) | same                                                                                                 | runs when started on `main`             |

A failing check means nothing is deployed. Locally, Husky runs the same checks: `pre-commit` (file-size limit,
ESLint, Stylelint, Prettier on staged files), `commit-msg` (Conventional Commits), `pre-push` (typecheck and tests).
`post-commit` only prints a summary.

---

## 1. GitHub repository settings (one time, about 10 minutes)

Repository: `github.com/Divalsehgal/jspractice` → **Settings**.

- [ ] **Actions → General → Workflow permissions:** leave "Read repository contents" as the default. The deploy job
      asks for `contents: write` itself. If your account or org blocks that, switch to "Read and write".
- [ ] **Pages → Build and deployment:** Source **Deploy from a branch**, branch **`gh-pages`**, folder **`/ (root)`**.
- [ ] **Secrets and variables → Actions → Secrets:** add `SONAR_TOKEN` (from step 3).
- [ ] **Secrets and variables → Actions → Variables** (both optional, add them when you need them):
  - `GOOGLE_SITE_VERIFICATION`: the code from Search Console (step 4). It is injected into every page at build time.
  - `SITE_URL`: only for a custom domain, such as `https://fegrind.dev/`. Leave it unset to use
    `https://divalsehgal.github.io/jspractice/`.
- [ ] **Branches → Add branch ruleset** for `main`: require a pull request, and require the status check **`verify`**
      to pass. The check only appears in the list after CI has run once, so do this after step 2.
- [ ] **Code security → Dependabot alerts / security updates:** turn on.
- [ ] Repository home page → **About** (gear icon): set **Website** to the site URL and add topics such as
      `interview-preparation`, `javascript`, `react`, `typescript`. This gives the site a first backlink.

## 2. First deploy

- [ ] Push `feat/grind-app` and open a pull request into `main`. Wait for the **verify** check to pass.
- [ ] Merge. The `deploy` job publishes to `gh-pages`. It uses `force_orphan`, so the branch is replaced with a single
      fresh commit; that is expected.
- [ ] Open `https://divalsehgal.github.io/jspractice/` and check:
  - a question page loads directly, for example `/jspractice/q/react/h-17/`, and refreshing it still works
  - `/jspractice/sitemap.xml` and `/jspractice/robots.txt` load
  - `/jspractice/review/` loads (served by the `404.html` fallback)
- [ ] Once the content is live, delete the old `tsPractice` and `datatable-ts` repositories. Their content is now in
      the TypeScript and Machine Coding subjects.

## 3. SonarCloud (one time, about 10 minutes)

`sonar-project.properties` is already configured: `organization=divalsehgal`, `projectKey=Divalsehgal_jspractice`.

- [ ] Sign in at [sonarcloud.io](https://sonarcloud.io) with GitHub. Create or import the organization **divalsehgal**.
      Its key must match `sonar.organization`.
- [ ] **Analyze new project** → select `Divalsehgal/jspractice`. Make sure the project key is `Divalsehgal_jspractice`.
- [ ] Project **Administration → Analysis Method:** turn **off** Automatic Analysis. CI runs the scan and uploads
      coverage, and the two modes conflict.
- [ ] **My Account → Security → Generate token**, then save it as the `SONAR_TOKEN` repository secret (step 1).
- [ ] Project **Administration → New Code:** choose "Previous version" or "Number of days: 30".
- [ ] Keep the **Sonar way** quality gate. Re-run CI (Actions → CI → Run workflow) and check that the dashboard shows
      about 99% coverage. If it shows 0%, the `coverage/lcov.info` path is wrong.
- [ ] Optional: copy the Quality Gate and Coverage badges (Project → Information) into `README.md`.

## 4. SEO (after the first deploy)

The site is already built for search: every question is a static page with its own title, description, canonical
URL, Open Graph image and JSON-LD, and the sitemap is generated from the question registry. What is left is telling
Google the site exists.

- [ ] [Google Search Console](https://search.google.com/search-console) → **Add property → URL prefix** →
      `https://divalsehgal.github.io/jspractice/`.
- [ ] Choose **HTML tag** verification. Copy only the `content="…"` value into the `GOOGLE_SITE_VERIFICATION`
      repository variable, then re-run CI on `main` (Actions → CI → Run workflow). When the deploy finishes, click
      **Verify**.
- [ ] **Sitemaps:** submit `sitemap.xml`. It is a sitemap index of 14 per-subject sitemaps, about 540 URLs.
- [ ] **URL inspection:** inspect the home page and 3–5 strong question pages, then click **Request indexing** on
      each. There is a small daily quota, so don't submit every page.
- [ ] [Bing Webmaster Tools](https://www.bing.com/webmasters): **Import from Google Search Console**. This also
      covers DuckDuckGo and Yahoo.
- [ ] Spot-check a question page with the [Rich Results Test](https://search.google.com/test/rich-results) and
      [PageSpeed Insights](https://pagespeed.web.dev/). Expected: valid structured data, mobile performance 95 or more.
- [ ] Get backlinks, the main remaining ranking factor: link the site from your GitHub profile README, LinkedIn
      and a dev.to or Hashnode post, and share specific question pages where people ask about them.
- [ ] Check back after 1–2 weeks: **Pages** (indexed vs not indexed, with reasons) and **Performance** (the queries
      you already appear for).

### Optional: custom domain (recommended for ranking)

A domain such as `fegrind.dev` ranks and shares better than a `github.io` sub-path. It is also the only way
`robots.txt` takes effect, because crawlers read it only at a domain root.

- [ ] Buy the domain. At the DNS provider, point the apex at GitHub Pages (four `A` records:
      `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and add a `CNAME` record for `www`
      pointing to `divalsehgal.github.io`.
- [ ] Add a `public/CNAME` file containing just the domain, so it is part of every deploy.
- [ ] Set the `SITE_URL` repository variable to `https://<domain>/`, then merge or re-run CI.
- [ ] **Settings → Pages:** enter the custom domain and tick **Enforce HTTPS** once the certificate is issued.
- [ ] In Search Console, add a **Domain** property for the new domain, submit its sitemap, and use **Change of
      address** if the old URL was already indexed.

## 5. Adding content later

Nothing to do by hand. Add questions under `src/content/subjects/`. On the next merge to `main`, each one gets its
own pre-rendered page, meta tags, structured data and sitemap entry. The build fails on duplicate question ids, and
the content gate fails if a reference solution doesn't pass its tests.
