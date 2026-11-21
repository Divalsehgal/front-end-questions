import { Page, PageHeader, SectionTitle } from '@fe-grind/ui';
import { AUTHOR, AUTHOR_PROFILES, JsonLd, pageMeta, REPO_URL, SITE_FAQ, SITE_NAME, siteDates, toMetadata } from '../../seo';

const meta = pageMeta('/about');
export const metadata = toMetadata(meta);

const link = 'font-medium text-brand-strong underline underline-offset-2';

export default function AboutPage() {
  const { modified } = siteDates();
  return (
    <Page width="narrow">
      <JsonLd meta={meta} />
      <PageHeader title={`About ${SITE_NAME}`} description="Free frontend interview practice, built in the open." />
      <div className="space-y-4 text-sm leading-6 text-text-muted">
        <p>
          {SITE_NAME} is a free practice site for frontend interviews, built and maintained by{' '}
          <a href={AUTHOR_PROFILES[0]} className={link} rel="author">
            {AUTHOR}
          </a>
          . The code and every question are open source on{' '}
          <a href={REPO_URL} className={link}>
            GitHub
          </a>
          .
        </p>
        <p>
          Found a wrong answer or want a question added?{' '}
          <a href={`${REPO_URL}/issues`} className={link}>
            Open an issue
          </a>
          .
        </p>
        {modified && (
          <p>
            Questions last updated <time dateTime={modified}>{new Date(modified).toLocaleDateString('en', { dateStyle: 'long', timeZone: 'UTC' })}</time>.
          </p>
        )}
      </div>

      <div>
        <SectionTitle id="faq">Frequently asked questions</SectionTitle>
        <dl className="space-y-5 text-sm leading-6">
          {SITE_FAQ.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-text-main">{f.q}</dt>
              <dd className="mt-1 text-text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Page>
  );
}
