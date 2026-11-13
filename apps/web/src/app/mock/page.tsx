import { pageMeta, toMetadata } from '../../seo';
import { MockSetup } from '../ClientPages';

export const metadata = toMetadata(pageMeta('/mock'));

export default function Page() {
  return <MockSetup />;
}
