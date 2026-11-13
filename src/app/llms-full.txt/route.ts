// Every question with its answer: needs the full bank.
import '../../content/bank';
import { llmsFullTxt } from '../../seo/llms';
import { text } from '../sitemaps/build';

export const dynamic = 'force-static';

export const GET = () => text(llmsFullTxt());
