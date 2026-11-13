import { llmsTxt } from '../../seo/llms';
import { text } from '../sitemaps/build';

export const dynamic = 'force-static';

export const GET = () => text(llmsTxt());
