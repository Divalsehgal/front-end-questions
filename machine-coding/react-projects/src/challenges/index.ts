/**
 * DYNAMIC CHALLENGE REGISTRATION
 *
 * How this works:
 * 1. import.meta.glob: Scans every subfolder (one level of category nesting allowed,
 *    e.g. ./ui-widgets/progress-bar/index.tsx) for index files.
 * 2. we extract the 'default' export (the component) AND the 'hint' named export.
 * 3. The challenge key is always the LEAF folder name (the one directly containing
 *    index.tsx), so nesting under a category folder doesn't change existing URLs/keys.
 * 4. This allows us to render the list and hints automatically without a central config file.
 */

const modules = import.meta.glob('./**/index.{tsx,ts,jsx,js}', { eager: true });

export interface ChallengeMetadata {
  component: React.ComponentType;
  hint: string;
  category?: string;
}

export const challenges = Object.entries(modules).reduce((acc, [path, module]) => {
  // path looks like "./category/folder-name/index.tsx" or "./folder-name/index.tsx"
  const parts = path.split('/');
  const folderName = parts[parts.length - 2];
  const category = parts.length > 3 ? parts[1] : undefined;

  // Transform kebab-case to PascalCase for the key
  const pascalName = folderName
    .split(/[-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  acc[pascalName] = {
    component: (module as any).default,
    hint: (module as any).hint || "",
    category
  };
  return acc;
}, {} as Record<string, ChallengeMetadata>);

export const challengeNames = Object.keys(challenges);
