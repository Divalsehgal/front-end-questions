import { pageMeta, toMetadata } from '../../seo';
import { Architecture } from '../ClientPages';

export const metadata = toMetadata(pageMeta('/architecture'));

export default function Page() {
  return <Architecture />;
}
