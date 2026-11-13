import { pageMeta, toMetadata } from '../../seo';
import { SessionSummary } from '../ClientPages';

export const metadata = toMetadata(pageMeta('/session'));

export default function Page() {
  return <SessionSummary />;
}
