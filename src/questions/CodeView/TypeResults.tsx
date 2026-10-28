import { ShieldCheck } from 'lucide-react';
import { Card, ResultHeader } from '../../ui';
import type { TypeIssue } from '../../runtime/typecheck';

export function TypeResults({ types, typeOnly }: { types: TypeIssue[]; typeOnly: boolean }) {
  return (
    <Card className="overflow-hidden">
      <ResultHeader ok={!types.length} icon={<ShieldCheck size={16} aria-hidden />}>
        {types.length ? `${types.length} type problem${types.length > 1 ? 's' : ''}` : typeOnly ? 'All type tests pass' : 'Types are correct'}
      </ResultHeader>
      <ul aria-label="Type problems">
        {types.map((t, i) => (
          <li key={i} className="border-t border-line px-4 py-2.5 text-sm">
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
