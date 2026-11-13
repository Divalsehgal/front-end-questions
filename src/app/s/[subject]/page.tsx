import { subjectHref, SUBJECTS } from '../../../content/registry';
import { SubjectPage } from '../../../screens/SubjectPage';
import { JsonLd, pageMeta, toMetadata } from '../../../seo';

type Props = Readonly<{ params: Promise<{ subject: string }> }>;

export const dynamicParams = false;
export const generateStaticParams = () => SUBJECTS.map((s) => ({ subject: s.slug }));
export const generateMetadata = async ({ params }: Props) => toMetadata(pageMeta(subjectHref((await params).subject)));

export default async function Subject({ params }: Props) {
  return (
    <>
      <JsonLd meta={pageMeta(subjectHref((await params).subject))} />
      <SubjectPage />
    </>
  );
}
