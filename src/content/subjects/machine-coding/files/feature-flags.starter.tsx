import { useState } from 'react';

type FeatureFlags = Record<string, boolean>;

const INITIAL_FLAGS: FeatureFlags = {
  show_beta_badge: false,
  new_dashboard: true,
  display_analytics: true,
  advanced_search: true,
};

export default function FeatureFlagDemo() {
  // your code
  return <div className="p-6">Start building here</div>;
}
