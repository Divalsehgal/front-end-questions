import { SUBJECTS } from '../../../content/registry';
import { sitemapFile } from '../../../seo/sitemap';
import { sitemaps, xml } from '../build';

type Context = Readonly<{ params: Promise<{ file: string }> }>;

export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => ['pages', ...SUBJECTS.map((s) => s.slug)].map((name) => ({ file: `${name}.xml` }));

export async function GET(_: Request, { params }: Context) {
  const { file } = await params;
  return xml(sitemaps().files[sitemapFile(file.replace(/\.xml$/, ''))]);
}
