import { SITEMAP_INDEX } from '../../seo/sitemap';
import { sitemaps, xml } from '../sitemaps/build';

export const dynamic = 'force-static';

export const GET = () => xml(sitemaps().files[SITEMAP_INDEX]);
