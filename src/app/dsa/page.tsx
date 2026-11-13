import { dsaMeta } from '../../dsa/meta';
import { DsaTree } from '../../screens/Dsa/DsaTree';
import { toMetadata } from '../../seo';

export const metadata = toMetadata(dsaMeta('/dsa/'));

export default function Page() {
  return <DsaTree />;
}
