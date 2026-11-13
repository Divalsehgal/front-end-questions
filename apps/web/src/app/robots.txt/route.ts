import { robotsTxt } from '../../seo';
import { text } from '../sitemaps/build';

export const GET = () => text(robotsTxt());
