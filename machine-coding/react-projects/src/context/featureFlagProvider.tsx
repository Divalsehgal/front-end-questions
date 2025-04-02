import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the type for feature flags
interface FeatureFlags {
  darkMode: boolean;
  chatEnabled: boolean;
}

// Define the context type
interface FlagContextType {
  features: FeatureFlags;
  setFeatures: React.Dispatch<React.SetStateAction<FeatureFlags>>;
}

// Create context with a default value that satisfies the type
const FlagContext = createContext<FlagContextType>({
  features: { darkMode: true, chatEnabled: false },
  setFeatures: () => {},
});

// Props type for the provider
interface FlagProviderProps {
  children: ReactNode;
}

// Provider component
export const FlagProvider = ({ children }: FlagProviderProps) => {
  const [features, setFeatures] = useState<FeatureFlags>({
    darkMode: true,
    chatEnabled: false,
  });

  return (
    <FlagContext.Provider value={{ features }}>{children}</FlagContext.Provider>
  );
};

// Custom hook for using this context
export const useFlags = () => useContext(FlagContext);

export default FlagContext;
