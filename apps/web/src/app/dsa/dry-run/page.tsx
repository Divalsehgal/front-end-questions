import { DsaDryRun } from '../../../screens/Dsa/DsaDryRun';
import { toMetadata } from '../../../seo';
import { dsaMeta } from '../../../seo/dsaMeta';

export const metadata = toMetadata(dsaMeta('/dsa/dry-run/'));

export default function Page() {
  return <DsaDryRun />;
}
