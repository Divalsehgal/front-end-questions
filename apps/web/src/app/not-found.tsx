import { Redirect } from '@fe-grind/ui/lib/Redirect';
import { pageMeta, toMetadata } from '../seo';

// Unknown paths (and stale links) answer 404, noindexed, and send people to the dashboard.
export const metadata = toMetadata(pageMeta('/404'));

export default function NotFound() {
  return <Redirect to="/" />;
}
