// The full bank on the server: question meta and JSON-LD need the question bodies.
import '@fe-grind/content/bank';
import { ALL, hrefOf, keyOf } from '@fe-grind/content/registry';
import { QuestionPage } from '../../../../screens/QuestionPage';
import { JsonLd, pageMeta, toMetadata } from '../../../../seo';

type Props = Readonly<{ params: Promise<{ subject: string; id: string }> }>;

const metaFor = async (params: Props['params']) => {
  const { subject, id } = await params;
  return pageMeta(hrefOf(keyOf(subject, id)));
};

export const dynamicParams = false;
export const generateStaticParams = () => ALL.map((e) => ({ subject: e.subject.slug, id: e.q.id }));
export const generateMetadata = async ({ params }: Props) => toMetadata(await metaFor(params));

export default async function Question({ params }: Props) {
  return (
    <>
      <JsonLd meta={await metaFor(params)} />
      <QuestionPage />
    </>
  );
}
