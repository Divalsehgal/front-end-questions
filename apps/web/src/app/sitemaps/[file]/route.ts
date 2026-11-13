import { SUBJECTS } from '@fe-grind/content/registry';
import { sitemapFile } from '../../../seo/sitemap';
import { sitemaps, xml } from '../build';

type Context = Readonly<{ params: Promise<{ file: string }> }>;

export const generateStaticParams = () => ['pages', ...SUBJECTS.map((s) => s.slug)].map((name) => ({ file: `${name}.xml` }));

export async function GET(_: Request, { params }: Context) {
  const { file } = await params;
  const body = (await sitemaps())[sitemapFile(file.replace(/\.xml$/, ''))];
  // Listed files are prerendered; anything else would render on request, so it has to 404 itself.
  return body ? xml(body) : new Response('Not found', { status: 404 });
}
