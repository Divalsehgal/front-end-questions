import { dsaMeta } from '../../../dsa/meta';
import { toMetadata } from '../../../seo';
import { DsaDrill } from '../../ClientPages';

export const metadata = toMetadata(dsaMeta('/dsa/drill/'));

export default function Page() {
  return <DsaDrill />;
}
