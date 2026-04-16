import React from 'react';

/**
 * THEME SHOWCASE
 * 
 * This component demonstrates the correct usage of our token-driven design system.
 * It is fully adaptive to Dark Mode and adheres to the strict "No Arbitrary Values" rule.
 */

export const ThemeShowcase: React.FC = () => {
  return (
    <div className="p-8 bg-canvas min-h-screen transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Correct Usage - Semantic Tokens */}
        <section className="space-y-4 shadow-soft p-6 bg-surface rounded-xl border border-subtle">
          <h2 className="text-2xl font-display text-text-main">
            Centralized Token System
          </h2>
          <p className="text-text-muted leading-relaxed">
            This card uses <code className="bg-muted px-1 rounded">bg-surface</code> and 
            <code className="bg-muted px-1 rounded">text-text-main</code>. 
            Try clicking the theme toggle to see it adapt instantly.
          </p>
          
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-brand-500 text-text-inverted rounded-md hover:bg-brand-600 transition-colors shadow-soft">
              Primary Action
            </button>
            <button className="px-4 py-2 bg-muted text-text-main rounded-md border border-subtle hover:bg-brand-50 transition-colors">
              Secondary Action
            </button>
          </div>
        </section>

        {/* Incorrect vs Correct Comparison */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border-2 border-error/20 rounded-lg bg-error/5">
            <h3 className="text-error font-bold mb-2">❌ INCORRECT (Hardcoded)</h3>
            <div className="bg-[#ffffff] p-[13px] text-[15px] border-[#e2e8f0] border">
               Uses magic numbers and hex codes.
               Build will FAIL linting.
            </div>
          </div>

          <div className="p-4 border-2 border-success/20 rounded-lg bg-success/5">
            <h3 className="text-success font-bold mb-2">✅ CORRECT (Tokenized)</h3>
            <div className="bg-surface p-3 text-text-main border-subtle border rounded-md shadow-soft">
               Uses semantic tokens only.
               Maintainable & Theme-ready.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
