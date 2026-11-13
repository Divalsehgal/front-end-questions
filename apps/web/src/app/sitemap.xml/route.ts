import { SITEMAP_INDEX } from '../../seo/sitemap';
import { sitemaps, xml } from '../sitemaps/build';

export const GET = async () => xml((await sitemaps())[SITEMAP_INDEX]);
