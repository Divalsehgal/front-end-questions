// One description of the <head> tags per page, rendered two ways: to a string for the
// prerendered HTML, and onto `document.head` when the client navigates.
import { serializeJsonLd } from './jsonld';
import { OG_IMAGE, SITE_NAME, SITE_URL } from './site';
import { escapeHtml } from './text';
import type { PageMeta } from './meta';

type Tag = { tag: 'meta' | 'link'; attrs: Record<string, string> } | { tag: 'script'; json: string };

/** Marks tags this module owns, so client navigation can swap them without touching the rest of <head>. */
export const SEO_ATTR = 'data-seo';

export function headTags(meta: PageMeta): Tag[] {
  const m = (key: 'name' | 'property', id: string, content: string): Tag => ({ tag: 'meta', attrs: { [key]: id, content } });
  const image = SITE_URL + OG_IMAGE;
  return [
    m('name', 'description', meta.description),
    ...(meta.canonical ? [{ tag: 'link' as const, attrs: { rel: 'canonical', href: meta.canonical } }] : []),
    ...(meta.noindex ? [m('name', 'robots', 'noindex, follow')] : []),
    m('property', 'og:type', meta.ogType),
    m('property', 'og:site_name', SITE_NAME),
    m('property', 'og:locale', 'en_US'),
    m('property', 'og:title', meta.title),
    m('property', 'og:description', meta.description),
    ...(meta.canonical ? [m('property', 'og:url', meta.canonical)] : []),
    m('property', 'og:image', image),
    m('property', 'og:image:width', '1200'),
    m('property', 'og:image:height', '630'),
    m('property', 'og:image:alt', `${SITE_NAME}: frontend interview practice`),
    m('name', 'twitter:card', 'summary_large_image'),
    m('name', 'twitter:title', meta.title),
    m('name', 'twitter:description', meta.description),
    m('name', 'twitter:image', image),
    ...meta.jsonLd.map((data): Tag => ({ tag: 'script', json: serializeJsonLd(data) })),
  ];
}

/** HTML for the prerendered <head>: the <title> plus every tag above. */
export function renderHead(meta: PageMeta) {
  const tags = headTags(meta).map((t) => {
    if (t.tag === 'script') return `<script type="application/ld+json" ${SEO_ATTR}>${t.json}</script>`;
    const attrs = Object.entries(t.attrs).map(([k, v]) => `${k}="${escapeHtml(v)}"`);
    return `<${t.tag} ${attrs.join(' ')} ${SEO_ATTR}>`;
  });
  return [`<title>${escapeHtml(meta.title)}</title>`, ...tags].join('\n    ');
}

/** Client-side navigation: replace the previous page's tags with this page's. */
export function applyHead(meta: PageMeta, doc: Document = document) {
  doc.title = meta.title;
  doc.head.querySelectorAll(`[${SEO_ATTR}]`).forEach((el) => el.remove());
  for (const t of headTags(meta)) {
    const el = doc.createElement(t.tag);
    if (t.tag === 'script') {
      el.setAttribute('type', 'application/ld+json');
      el.textContent = t.json;
    } else {
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    }
    el.setAttribute(SEO_ATTR, '');
    doc.head.append(el);
  }
}
