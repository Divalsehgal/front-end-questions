import React, { ReactNode } from "react";

interface ProviderComposerProps {
  providers: React.ReactElement[];
  children: ReactNode;
}

/**
 * A utility component to flatten the provider tree.
 * Prevents "Provider Hell" by dynamically nesting providers.
 */
const ProviderComposer: React.FC<ProviderComposerProps> = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight((acc, provider) => {
        return React.cloneElement(provider, {}, acc);
      }, children)}
    </>
  );
};

export default ProviderComposer;
