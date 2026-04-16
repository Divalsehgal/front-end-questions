# Learning Gist: Frequent Word Analyzer

### 🧠 The Core Logic
Identify the most frequent non-banned words in a large text string. Mastery of string parsing and efficient frequency counting.

### 🛠️ Implementation Strategy
1. **Preprocessing**: Normalize the text (lowercase) and extract tokens using Regex `/[a-z0-9]+/g`.
2. **Filtering**: Convert the `banned` array into a `Set` for O(1) lookups.
3. **Counting**: Use a `Map` to store word frequencies.
4. **Ranking**: Convert the Map to an array of entries and sort it.
   - Primary Sort: count (descending).
   - Secondary Sort: word (alphabetical) to ensure consistent tie-breaking.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on why a `Map` is better than a plain object (prevents prototype collision, better for frequently updated keys).
- **Scalability**: How would you handle a text file that doesn't fit in memory? (Streaming/External Merge Sort).
- **Time Complexity**: O(N log K) or O(N log N) depending on the number of unique words and sorting.

```typescript
function getFrequentWords(text, banned, count) {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  const bannedSet = new Set(banned);
  const map = new Map();
  
  words.forEach(w => {
    if (!bannedSet.has(w)) map.set(w, (map.get(w) || 0) + 1);
  });
  
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(e => e[0]);
}
```
