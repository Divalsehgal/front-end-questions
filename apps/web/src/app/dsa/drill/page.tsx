import { toMetadata } from '../../../seo';
import { dsaMeta } from '../../../seo/dsaMeta';
import { DsaDrill } from '../../ClientPages';

export const metadata = toMetadata(dsaMeta('/dsa/drill/'));

export default function Page() {
  return <DsaDrill />;
}
