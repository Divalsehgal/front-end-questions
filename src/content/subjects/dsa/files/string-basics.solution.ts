export function titleCase(str: string): string {
  const words = str.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i] !== '') {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1);
    }
  }
  return words.join(' ');
}

// Try every length from the longest down. A length works if it divides both strings
// and repeating that piece rebuilds each of them.
export function gcdOfStrings(s1: string, s2: string): string {
  for (let len = Math.min(s1.length, s2.length); len > 0; len--) {
    if (s1.length % len !== 0 || s2.length % len !== 0) continue;
    const piece = s1.slice(0, len);
    if (piece.repeat(s1.length / len) === s1 && piece.repeat(s2.length / len) === s2) {
      return piece;
    }
  }
  return '';
}

// A palindrome can have at most one letter that appears an odd number of times.
export function isPalindromePermutation(s: string): boolean {
  const counts: Record<string, number> = {};
  for (const char of s.toLowerCase()) {
    if (char === ' ') continue;
    counts[char] = (counts[char] || 0) + 1;
  }
  let oddCount = 0;
  for (const char in counts) {
    if (counts[char] % 2 === 1) oddCount++;
  }
  return oddCount <= 1;
}
