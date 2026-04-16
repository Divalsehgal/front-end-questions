/**
 * DYNAMIC CHALLENGE REGISTRATION
 * 
 * How this works:
 * 1. import.meta.glob: Scans all subfolders for index files.
 * 2. we extract the 'default' export (the component) AND the 'hint' named export.
 * 3. This allows us to render the list and hints automatically without a central config file.
 */

const modules = import.meta.glob('./*/index.{tsx,ts,jsx,js}', { eager: true });

export interface ChallengeMetadata {
  component: React.ComponentType;
  hint: string;
}

export const challenges = Object.entries(modules).reduce((acc, [path, module]) => {
  const folderName = path.split('/')[1];
  
  // Transform kebab-case to PascalCase for the key
  const pascalName = folderName
    .split(/[-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  acc[pascalName] = {
    component: (module as any).default,
    hint: (module as any).hint || ""
  };
  return acc;
}, {} as Record<string, ChallengeMetadata>);

export const challengeNames = Object.keys(challenges);
