// One description of the <head> tags per page (./meta), turned into Next's Metadata, plus the
// JSON-LD scripts the page body carries. Next renders both into the static HTML and swaps them on
// client navigation.
import { withStableKeys } from '@fe-grind/ui/lib/stableKeys';
import { serializeJsonLd } from './jsonld';
import { OG_IMAGE, SITE_ALT_NAMES, SITE_NAME, SITE_URL } from './site';
import type { PageMeta } from './meta';
import type { Metadata } from 'next';

export function toMetadata(meta: PageMeta): Metadata {
  const image = { url: SITE_URL + OG_IMAGE, width: 1200, height: 630, alt: `${SITE_ALT_NAMES[0]} (${SITE_NAME}): frontend interview practice` };
  return {
    title: { absolute: meta.title },
    description: meta.description,
    ...(meta.canonical && { alternates: { canonical: meta.canonical } }),
    ...(meta.noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      type: meta.ogType,
      siteName: SITE_NAME,
      locale: 'en_US',
      title: meta.title,
      description: meta.description,
      ...(meta.canonical && { url: meta.canonical }),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [image.url] },
  };
}

/** The page's JSON-LD as <script type="application/ld+json"> tags (content escaped by serializeJsonLd). */
export function JsonLd({ meta }: Readonly<{ meta: PageMeta }>) {
  // serializeJsonLd escapes "<", so content can't close the tag.
  return withStableKeys(meta.jsonLd.map(serializeJsonLd)).map(({ item, key }) => (
    <script key={key} type="application/ld+json" dangerouslySetInnerHTML={{ __html: item }} />
  ));
}
