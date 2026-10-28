function countLetters(str: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const char of str) {
    if (counts[char]) counts[char]++;
    else counts[char] = 1;
  }
  return counts;
}

export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const countS = countLetters(s);
  const countT = countLetters(t);
  for (const char in countS) {
    if (countS[char] !== countT[char]) return false;
  }
  return true;
}

// Anagrams have the same letters, so sorting the letters gives the same key.
export function groupAnagrams(words: string[]): string[][] {
  const groups: Record<string, string[]> = {};
  for (const word of words) {
    const key = word.split('').sort().join('');
    if (!groups[key]) groups[key] = [];
    groups[key].push(word);
  }
  return Object.values(groups);
}

// Keep only the last k numbers in a Set.
export function containsNearbyDuplicate(nums: number[], k: number): boolean {
  const set = new Set<number>();
  for (let i = 0; i < nums.length; i++) {
    if (set.has(nums[i])) return true;
    set.add(nums[i]);
    if (set.size > k) {
      set.delete(nums[i - k]); // too far back now
    }
  }
  return false;
}
