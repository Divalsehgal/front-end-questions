import { DsaPatterns } from '../../../screens/Dsa/DsaPatterns';
import { toMetadata } from '../../../seo';
import { dsaMeta } from '../../../seo/dsaMeta';

export const metadata = toMetadata(dsaMeta('/dsa/patterns/'));

export default function Page() {
  return <DsaPatterns />;
}
