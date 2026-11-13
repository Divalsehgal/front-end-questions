import { DsaTree } from '../../screens/Dsa/DsaTree';
import { toMetadata } from '../../seo';
import { dsaMeta } from '../../seo/dsaMeta';

export const metadata = toMetadata(dsaMeta('/dsa/'));

export default function Page() {
  return <DsaTree />;
}
