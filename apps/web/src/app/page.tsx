import { Dashboard } from '../screens/Dashboard';
import { JsonLd, pageMeta, toMetadata } from '../seo';

const meta = pageMeta('/');
export const metadata = toMetadata(meta);

export default function HomePage() {
  return (
    <>
      <JsonLd meta={meta} />
      <Dashboard />
    </>
  );
}
