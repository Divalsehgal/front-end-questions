import { robotsTxt } from '../../seo';
import { text } from '../sitemaps/build';

export const dynamic = 'force-static';

export const GET = () => text(robotsTxt());
