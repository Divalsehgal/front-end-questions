import { dsaMeta } from '../../../dsa/meta';
import { DsaPatterns } from '../../../screens/Dsa';
import { toMetadata } from '../../../seo';

export const metadata = toMetadata(dsaMeta('/dsa/patterns/'));

export default function Page() {
  return <DsaPatterns />;
}
