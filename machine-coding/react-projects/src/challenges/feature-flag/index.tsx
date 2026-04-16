import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import { 
  Flag, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Sparkles,
  RefreshCw
} from "lucide-react";

export const hint = "System for remote feature orchestration with a Provider pattern and hook-based resolution";

// --- Logic Layer ---

type FeatureFlags = Record<string, boolean>;

const INITIAL_FLAGS: FeatureFlags = {
  show_beta_badge: true,
  enable_premium_ui: false,
  display_analytics: true,
  advanced_search: false,
};

interface FeatureFlagContextType {
  flags: FeatureFlags;
  toggleFlag: (key: string) => void;
  isLoading: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(INITIAL_FLAGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial remote fetch
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleFlag = (key: string) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, toggleFlag, isLoading }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(key: string, defaultValue = false) {
  const context = useContext(FeatureFlagContext);
  if (!context) throw new Error("useFeatureFlag must be used within a FeatureFlagProvider");
  return context.flags[key] ?? defaultValue;
}

// --- UI Layer ---

function FlagCard({ flagKey, label, description, icon: Icon }: any) {
  const context = useContext(FeatureFlagContext);
  const isEnabled = context?.flags[flagKey];

  return (
    <div className={cn(
      "p-5 rounded-3xl border-2 transition-all duration-300 group",
      isEnabled 
        ? "bg-brand-500/5 border-brand-500/30 shadow-soft" 
        : "bg-surface border-subtle opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-2xl transition-colors",
          isEnabled ? "bg-brand-500 text-text-inverted" : "bg-muted text-text-muted/50"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <button 
          onClick={() => context?.toggleFlag(flagKey)}
          className={cn(
            "transition-colors",
            isEnabled ? "text-brand-500" : "text-text-muted/30"
          )}
        >
          {isEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
        </button>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-black text-text-main uppercase tracking-tight">{label}</h4>
        <p className="text-xs font-medium text-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ExperienceDemo() {
  const isPremium = useFeatureFlag("enable_premium_ui");
  const hasBadge = useFeatureFlag("show_beta_badge");

  return (
    <div className={cn(
      "mt-8 p-8 rounded-3xl border-4 transition-all duration-700 relative overflow-hidden",
      isPremium 
        ? "bg-brand-500 border-brand-500/20 text-text-inverted shadow-hard" 
        : "bg-surface border-subtle text-text-muted"
    )}>
      {isPremium && (
        <div className="absolute top-0 right-0 p-8 opacity-10 animate-pulse text-text-inverted">
          <Sparkles className="w-32 h-32 rotate-12" />
        </div>
      )}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className={cn(
            "text-2xl font-black uppercase tracking-tighter transition-colors",
            isPremium ? "text-text-inverted" : "text-text-main"
          )}>
            Application Portal
          </h3>
          {hasBadge && (
            <span className="px-2 py-0.5 bg-warning-500 text-warning-950 text-tiny font-black rounded-lg uppercase tracking-widest animate-bounce">
              BETA
            </span>
          )}
        </div>
        <p className={cn(
          "text-sm font-medium leading-relaxed max-w-sm transition-colors",
          isPremium ? "text-text-inverted/70" : "text-text-muted"
        )}>
          {isPremium 
            ? "Welcome to the elite tier. All experimental features and sub-atomic optimizations are currently active in your environment."
            : "Standard environment active. Enable 'Premium UI' in the console above to unlock advanced instrumentation."
          }
        </p>
        <button className={cn(
          "px-6 py-2.5 rounded-xl font-black text-tiny uppercase tracking-widest transition-all",
          isPremium 
            ? "bg-surface text-brand-500 shadow-soft" 
            : "bg-text-main text-text-inverted shadow-soft"
        )}>
          {isPremium ? "Access Neural Core" : "Upgrade Engine"}
        </button>
      </div>
    </div>
  );
}

export default function FeatureFlagChallenge() {
  return (
    <FeatureFlagProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight uppercase">
              <ShieldCheck className="w-7 h-7 text-brand-500" />
              ORCHESTRATOR
            </h2>
            <p className="text-sm font-medium text-text-muted">
              Granular control over environment-specific feature sets.
            </p>
          </div>
          <div className="p-3 bg-muted rounded-2xl">
             <RefreshCw className="w-5 h-5 text-text-muted opacity-30 animate-spin-slow" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-4 pt-4">
           <h3 className="text-tiny font-black uppercase tracking-[0.2em] text-text-muted ml-1 opacity-50">Live Preview</h3>
           <ExperienceDemo />
        </div>
      </div>
    </FeatureFlagProvider>
  );
}
