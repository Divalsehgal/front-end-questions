import { pageMeta, toMetadata } from '../../seo';
import { Review } from '../ClientPages';

export const metadata = toMetadata(pageMeta('/review'));

export default function Page() {
  return <Review />;
}
