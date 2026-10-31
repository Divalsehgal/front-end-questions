# Action plan: front-end-grind.vercel.app

## High (this week)

1. **Deploy the brand-name fix** that's already made locally: home title "Front End Grind (FE Grind): …" and `WebSite.alternateName`. Effort: commit + push.
2. **Brand phrase on the page**: home H1 or the line under it says "Front End Grind"; `og:site_name`, `manifest.name` and the `llms.txt` heading say "FE Grind (Front End Grind)". Effort: 15 min.
3. **Search Console**: inspect `/`, request indexing, resubmit `sitemap.xml`. Effort: 5 min.
4. **Links from other sites with the brand anchor**: GitHub repo "Website" field + README badge, GitHub profile README, LinkedIn featured link, one dev.to/Hashnode/Reddit (r/Frontend, r/reactjs) launch post. Effort: 1–2 h. _This is the biggest lever for ranking on your brand name._

## Medium (this month)

5. **Custom domain** (e.g. `frontendgrind.dev`), with a 301 from `vercel.app` and the new property in Search Console. `SITE_URL` already follows env, so this is config-only. Effort: 30 min + domain cost.
6. **About page** (indexable): who you are, your experience, how questions are written and checked. Link it from the footer and add it to `Person.url`. Effort: 1 h.
7. **Lengthen the 37 shortest question pages** (<200 words) with an example or a "common mistake". Effort: ongoing.

## Low (backlog)

8. Make the 3 duplicate React descriptions unique.
9. Add `publisher` with a logo `ImageObject` to the `WebSite` JSON-LD.
10. Trim ~35 KiB of unused JS from the main bundle.

## Monitoring

- Search Console → Performance → filter queries containing "grind": track impressions and position weekly.
- Re-run this audit after the custom domain move.
