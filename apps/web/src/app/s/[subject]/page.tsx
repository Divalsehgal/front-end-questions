import { subjectHref, SUBJECTS } from '@fe-grind/content/registry';
import { notFound } from 'next/navigation';
import { SubjectPage } from '../../../screens/SubjectPage';
import { JsonLd, pageMeta, toMetadata } from '../../../seo';

type Props = Readonly<{ params: Promise<{ subject: string }> }>;

export const generateStaticParams = () => SUBJECTS.map((s) => ({ subject: s.slug }));
export const generateMetadata = async ({ params }: Props) => toMetadata(pageMeta(subjectHref((await params).subject)));

export default async function Subject({ params }: Props) {
  const { subject } = await params;
  // Every subject is prerendered; an unknown one renders on request and must 404.
  if (!SUBJECTS.some((s) => s.slug === subject)) notFound();
  return (
    <>
      <JsonLd meta={pageMeta(subjectHref(subject))} />
      <SubjectPage />
    </>
  );
}
