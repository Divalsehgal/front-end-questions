import { pageMeta, toMetadata } from '../../seo';
import { Settings } from '../ClientPages';

export const metadata = toMetadata(pageMeta('/settings'));

export default function Page() {
  return <Settings />;
}
