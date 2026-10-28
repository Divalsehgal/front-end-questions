import { ARCHITECTURE, ArchitectureView } from '../../architecture';
import { Page, PageHeader } from '../../ui';

/** How the app fits together, for newcomers to the codebase. Client-only, like /settings. */
export function Architecture() {
  return (
    <Page width="wide">
      <PageHeader
        title={ARCHITECTURE.title}
        description={
          <>
            <p>What talks to what, and why. Click a part to see what it does and what it connects to.</p>
            <p className="mt-1 text-sm">{ARCHITECTURE.subtitle}</p>
          </>
        }
      />
      <ArchitectureView architecture={ARCHITECTURE} />
    </Page>
  );
}
