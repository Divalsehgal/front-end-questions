import type { Entry } from '../../content/registry';
import type { Attempt } from '../../state/progress';

/**
 * Builds a mock round: weak and unseen questions first, then shuffled within the round,
 * optionally finishing with one coding drill. `random` is injectable for tests.
 */
export function pickRound(
  pool: Entry[],
  progress: Record<string, Attempt>,
  size: number,
  codeDrills: Entry[] = [],
  random: () => number = Math.random,
): Entry[] {
  // Wrong answers first, then unseen questions, then the rest; random() breaks ties.
  const rank = (key: string) => {
    if (!progress[key]) return 1;
    return progress[key].status === 'wrong' ? 0 : 2;
  };
  const weight = (key: string) => rank(key) + random();
  const weights = new Map(pool.map((e) => [e.key, weight(e.key)]));
  const picked = [...pool]
    .sort((a, b) => (weights.get(a.key) ?? 0) - (weights.get(b.key) ?? 0))
    .slice(0, size)
    .map((e) => ({ e, r: random() }))
    .sort((a, b) => a.r - b.r)
    .map(({ e }) => e);
  if (codeDrills.length) picked.push(codeDrills[Math.floor(random() * codeDrills.length)]);
  return picked;
}
