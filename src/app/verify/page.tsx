import { notFound } from 'next/navigation';
import { pageMeta, toMetadata } from '../../seo';
import { Verify } from '../ClientPages';

// Dev-only content health check: runs every question's checks (see src/screens/Verify).
export const metadata = toMetadata(pageMeta('/verify'));

export default function Page() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <Verify />;
}
