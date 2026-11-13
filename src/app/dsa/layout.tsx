'use client';

import { DsaNav } from '../../screens/Dsa';
import { Page, PageHeader } from '../../ui';
import type { ReactNode } from 'react';

export default function DsaLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Page width="wide">
      <PageHeader title="DSA patterns" description="LeetCode questions by pattern, a cheat sheet, a pattern drill and step-by-step dry runs." />
      <div className="mb-6">
        <DsaNav />
      </div>
      {children}
    </Page>
  );
}
