import { dsaMeta } from '../../../dsa/meta';
import { DsaDryRun } from '../../../screens/Dsa';
import { toMetadata } from '../../../seo';

export const metadata = toMetadata(dsaMeta('/dsa/dry-run/'));

export default function Page() {
  return <DsaDryRun />;
}
