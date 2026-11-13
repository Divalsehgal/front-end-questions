// The full bank on the server: question meta and JSON-LD need the question bodies.
import '@fe-grind/content/bank';
import { ALL, getEntry, hrefOf, keyOf } from '@fe-grind/content/registry';
import { notFound } from 'next/navigation';
import { QuestionPage } from '../../../../screens/QuestionPage';
import { JsonLd, pageMeta, toMetadata } from '../../../../seo';

type Props = Readonly<{ params: Promise<{ subject: string; id: string }> }>;

const metaFor = async (params: Props['params']) => {
  const { subject, id } = await params;
  return pageMeta(hrefOf(keyOf(subject, id)));
};

export const generateStaticParams = () => ALL.map((e) => ({ subject: e.subject.slug, id: e.q.id }));
export const generateMetadata = async ({ params }: Props) => toMetadata(await metaFor(params));

export default async function Question({ params }: Props) {
  const { subject, id } = await params;
  // Every question is prerendered; an unknown one renders on request and must 404.
  if (!getEntry(keyOf(subject, id))) notFound();
  return (
    <>
      <JsonLd meta={await metaFor(params)} />
      <QuestionPage />
    </>
  );
}
