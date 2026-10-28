import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type FeatureFlags = Record<string, boolean>;

const INITIAL_FLAGS: FeatureFlags = {
  show_beta_badge: false,
  new_dashboard: true,
  display_analytics: true,
  advanced_search: true,
};

interface FeatureFlagContextType {
  flags: FeatureFlags;
  toggleFlag: (key: string) => void;
  isLoading: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | null>(null);

export function FeatureFlagProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [isLoading, setIsLoading] = useState(true);

  // Simulates fetching flags from a server.
  useEffect(() => {
    const timer = setTimeout(() => {
      setFlags(INITIAL_FLAGS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleFlag = useCallback((key: string) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Stable object identity unless something actually changed, so consumers don't re-render on
  // every provider render.
  const value = useMemo(() => ({ flags, toggleFlag, isLoading }), [flags, toggleFlag, isLoading]);

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}

function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (!context) throw new Error("useFeatureFlag must be used within a FeatureFlagProvider");
  return context;
}

/** Unknown flags (and every flag while loading) read as off. */
export function useFeatureFlag(key: string): boolean {
  return useFeatureFlags().flags[key] ?? false;
}

/** Renders children only when the flag is on; `fallback` otherwise. */
export function Feature({
  flag,
  children,
  fallback = null,
}: Readonly<{ flag: string; children: ReactNode; fallback?: ReactNode }>) {
  return <>{useFeatureFlag(flag) ? children : fallback}</>;
}

// --- UI ---

function FlagToggle({ flagKey, label, description }: Readonly<{ flagKey: string; label: string; description: string }>) {
  const { toggleFlag, isLoading } = useFeatureFlags();
  const enabled = useFeatureFlag(flagKey);

  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-4 has-disabled:cursor-wait has-disabled:opacity-60">
      <span className="space-y-1">
        <span className="block text-sm font-semibold text-text-main">{label}</span>
        <span className="block text-xs text-text-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={enabled}
        disabled={isLoading}
        onChange={() => toggleFlag(flagKey)}
        className="mt-1 size-5 accent-brand-500"
      />
    </label>
  );
}

function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-text-main">Dashboard</h3>
        <Feature flag="show_beta_badge">
          <span className="rounded-md bg-warning px-2 py-0.5 text-xs font-semibold text-text-main">Beta</span>
        </Feature>
      </div>

      <Feature
        flag="new_dashboard"
        fallback={<p className="text-sm text-text-muted">Turn on 'New dashboard' above to preview it.</p>}
      >
        <div className="flex items-center justify-between rounded-xl bg-brand-500 p-4 text-text-inverted">
          <p className="text-sm">The new dashboard is on.</p>
          <button className="rounded-lg bg-surface px-4 py-1.5 text-sm font-semibold text-brand-600">Open</button>
        </div>
      </Feature>

      <Feature flag="display_analytics">
        <div className="rounded-xl border border-border-subtle p-4 text-sm text-text-main">Analytics: 1,204 visits today</div>
      </Feature>

      <Feature flag="advanced_search" fallback={<input placeholder="Search" className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm" />}>
        <div className="flex gap-2">
          <input placeholder="Search" className="flex-1 rounded-lg border border-border-subtle px-3 py-2 text-sm" />
          <select className="rounded-lg border border-border-subtle px-2 text-sm" aria-label="Filter">
            <option>All</option>
            <option>Docs</option>
            <option>People</option>
          </select>
        </div>
      </Feature>

      {/* Not in the flag set, so it defaults to off and never renders. */}
      <Feature flag="unknown_flag">
        <p>You should never see this.</p>
      </Feature>
    </div>
  );
}

function Content() {
  const { isLoading } = useFeatureFlags();

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {isLoading && (
        <p role="status" className="text-sm text-text-muted">
          Loading flags…
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FlagToggle flagKey="show_beta_badge" label="Beta badge" description="Shows a Beta label on the dashboard." />
        <FlagToggle flagKey="new_dashboard" label="New dashboard" description="Shows the redesigned dashboard." />
        <FlagToggle flagKey="display_analytics" label="Analytics" description="Shows the analytics panel." />
        <FlagToggle flagKey="advanced_search" label="Advanced search" description="Enables filters in search." />
      </div>
      <div className="rounded-2xl border border-border-subtle bg-canvas p-6">
        <Dashboard />
      </div>
    </div>
  );
}

export default function FeatureFlagChallenge() {
  return (
    <FeatureFlagProvider>
      <Content />
    </FeatureFlagProvider>
  );
}
