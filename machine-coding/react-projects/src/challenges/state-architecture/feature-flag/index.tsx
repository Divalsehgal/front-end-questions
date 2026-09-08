import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { cn } from "../../../utils/cn";
import {
  Flag,
  ToggleLeft,
  ToggleRight,
  Zap,
  Lock,
  Sparkles,
} from "lucide-react";


type FeatureFlags = Record<string, boolean>;

const INITIAL_FLAGS: FeatureFlags = {
  show_beta_badge: false,
  enable_premium_ui: true,
  display_analytics: true,
  advanced_search: true,
};

interface FeatureFlagContextType {
  flags: FeatureFlags;
  toggleFlag: (key: string) => void;
  isLoading: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(
  undefined,
);

export function FeatureFlagProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [flags, setFlags] = useState<FeatureFlags>(INITIAL_FLAGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleFlag = useCallback((key: string) => {
    setFlags((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? true : !prev[key],
    }));
  }, []);

  const memoisedValue = useMemo(
    () => ({ flags, toggleFlag, isLoading }),
    [flags, toggleFlag, isLoading],
  );

  return (
    <FeatureFlagContext.Provider value={memoisedValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(key: string, defaultValue = false) {
  const context = useContext(FeatureFlagContext);
  if (!context)
    throw new Error("useFeatureFlag must be used within a FeatureFlagProvider");
  return context.flags[key] ?? defaultValue;
}

// --- UI Layer ---

function FlagCard({ flagKey, label, description, icon: Icon }: any) {
  const context = useContext(FeatureFlagContext);
  const isEnabled = context?.flags[flagKey];

  return (
    <div
      className={cn(
        "group rounded-3xl border-2 p-5 transition-all duration-300",
        isEnabled
          ? "border-brand-500/30 bg-brand-500/5 shadow-soft"
          : "border-subtle bg-surface opacity-60 grayscale hover:opacity-100 hover:grayscale-0",
      )}
    >
     
        <button
          onClick={() => context?.toggleFlag(flagKey)}
          className={cn(
            "transition-colors",
            isEnabled ? "text-brand-500" : "text-text-muted/30",
          )}
        >
          {isEnabled ? (
            <ToggleRight className="size-10" />
          ) : (
            <ToggleLeft className="size-10" />
          )}
        </button>
  
      <div className="space-y-1">
        <h4 className="text-sm font-black tracking-tight text-text-main uppercase">
          {label}
        </h4>
        <p className="text-xs leading-relaxed font-medium text-text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}

function ExperienceDemo() {
  const isPremium = useFeatureFlag("enable_premium_ui");
  const hasBadge = useFeatureFlag("show_beta_badge");

  return (
    <div
      className={cn(
        "relative mt-8 overflow-hidden rounded-3xl border-4 p-8 transition-all duration-700",
        isPremium
          ? "border-brand-500/20 bg-brand-500 text-text-inverted shadow-hard"
          : "border-subtle bg-surface text-text-muted",
      )}
    >
      {isPremium && (
        <div className="absolute top-0 right-0 animate-pulse p-8 text-text-inverted opacity-10">
          <Sparkles className="size-32 rotate-12" />
        </div>
      )}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <h3
            className={cn(
              "text-2xl font-black tracking-tighter uppercase transition-colors",
              isPremium ? "text-text-inverted" : "text-text-main",
            )}
          >
            Application Portal
          </h3>
          {hasBadge && (
            <span className="bg-warning-500 text-warning-950 text-tiny animate-bounce rounded-lg px-2 py-0.5 font-black tracking-widest uppercase">
              BETA
            </span>
          )}
        </div>
        <p
          className={cn(
            "max-w-sm text-sm leading-relaxed font-medium transition-colors",
            isPremium ? "text-text-inverted/70" : "text-text-muted",
          )}
        >
          {isPremium
            ? "Welcome to the elite tier. All experimental features and sub-atomic optimizations are currently active in your environment."
            : "Standard environment active. Enable 'Premium UI' in the console above to unlock advanced instrumentation."}
        </p>
        <button
          className={cn(
            "text-tiny rounded-xl px-6 py-2.5 font-black tracking-widest uppercase transition-all",
            isPremium
              ? "bg-surface text-brand-500 shadow-soft"
              : "bg-text-main text-text-inverted shadow-soft",
          )}
        >
          {isPremium ? "Access Neural Core" : "Upgrade Engine"}
        </button>
      </div>
    </div>
  );
}

export default function FeatureFlagChallenge() {
  return (
    <FeatureFlagProvider>
      <div className="mx-auto max-w-4xl space-y-8 p-6 pb-20">


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FlagCard
            flagKey="show_beta_badge"
            label="Beta Visibility"
            description="Toggle the visibility of experimental labeling across the entire portal."
            icon={Zap}
          />
          <FlagCard
            flagKey="enable_premium_ui"
            label="Premium UI"
            description="Switch to the high-performance emerald design system with enhanced visual contrast."
            icon={Sparkles}
          />
          <FlagCard
            flagKey="display_analytics"
            label="Core Analytics"
            description="Enable real-time telemetry tracking and user behavior metrics."
            icon={Flag}
          />
          <FlagCard
            flagKey="advanced_search"
            label="Neural Search"
            description="Activate the experimental search engine with deep-linking capabilities."
            icon={Lock}
          />
        </div>

          <h3 className="text-tiny ml-1 font-black tracking-[0.2em] text-text-muted uppercase opacity-50">
            Live Preview
          </h3>
          <ExperienceDemo />
      </div>
    </FeatureFlagProvider>
  );
}
