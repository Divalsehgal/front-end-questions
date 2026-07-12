import React from 'react';

/**
 * THEME SHOWCASE
 * 
 * This component demonstrates the correct usage of our token-driven design system.
 * It is fully adaptive to Dark Mode and adheres to the strict "No Arbitrary Values" rule.
 */

export const ThemeShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas p-8 transition-colors duration-300">
      <div className="mx-auto max-w-2xl space-y-8">
        
        {/* Correct Usage - Semantic Tokens */}
        <section className="border-subtle space-y-4 rounded-xl border bg-surface p-6 shadow-soft">
          <h2 className="font-display text-2xl text-text-main">
            Centralized Token System
          </h2>
          <p className="leading-relaxed text-text-muted">
            This card uses <code className="rounded bg-muted px-1">bg-surface</code> and 
            <code className="rounded bg-muted px-1">text-text-main</code>. 
            Try clicking the theme toggle to see it adapt instantly.
          </p>
          
          <div className="flex gap-4">
            <button className="rounded-md bg-brand-500 px-4 py-2 text-text-inverted shadow-soft transition-colors hover:bg-brand-600">
              Primary Action
            </button>
            <button className="border-subtle rounded-md border bg-muted px-4 py-2 text-text-main transition-colors hover:bg-brand-50">
              Secondary Action
            </button>
          </div>
        </section>

        {/* Incorrect vs Correct Comparison */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border-2 border-error/20 bg-error/5 p-4">
            <h3 className="mb-2 font-bold text-error">❌ INCORRECT (Hardcoded)</h3>
            <div className="border border-[#e2e8f0] bg-[#ffffff] p-[13px] text-[15px]">
               Uses magic numbers and hex codes.
               Build will FAIL linting.
            </div>
          </div>

          <div className="rounded-lg border-2 border-success/20 bg-success/5 p-4">
            <h3 className="mb-2 font-bold text-success">✅ CORRECT (Tokenized)</h3>
            <div className="border-subtle rounded-md border bg-surface p-3 text-text-main shadow-soft">
               Uses semantic tokens only.
               Maintainable & Theme-ready.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
