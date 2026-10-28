import { ShieldCheck } from 'lucide-react';
import { Card, ResultHeader, withStableKeys } from '../../ui';
import type { TypeIssue } from '../../runtime/typecheck';

function summary(count: number, typeOnly: boolean) {
  if (count) return `${count} type problem${count > 1 ? 's' : ''}`;
  return typeOnly ? 'All type tests pass' : 'Types are correct';
}

const issueKey = (t: TypeIssue) => `${t.inTypeTests ? 'tests' : 'code'}:${t.line}:${t.source}:${t.shouldFail ?? t.message}`;

export function TypeResults({ types, typeOnly }: Readonly<{ types: TypeIssue[]; typeOnly: boolean }>) {
  return (
    <Card className="overflow-hidden">
      <ResultHeader ok={!types.length} icon={<ShieldCheck size={16} aria-hidden />}>
        {summary(types.length, typeOnly)}
      </ResultHeader>
      <ul aria-label="Type problems">
        {withStableKeys(types, issueKey).map(({ item: t, key }) => (
          <li key={key} className="border-t border-line px-4 py-2.5 text-sm">
            <p className="mb-1 text-xs text-text-muted">{t.inTypeTests ? 'Type test' : `Your code, line ${t.line}`}</p>
            <code className="block font-mono text-xs break-all">{t.source}</code>
            <p className="mt-1">
              {t.shouldFail ? (
                <>
                  This should be a compile error <span className="text-text-muted">({t.shouldFail})</span>, but your types allow it.
                </>
              ) : (
                t.message
              )}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
