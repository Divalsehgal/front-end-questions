// Builds src/generated/dsa-traces.json: a traced reference run of every exercise on its first example.
// Run with: npm run dsa:traces
// Each run(t) calls t(note, vars) to record variable states. Lines ending in "// hide"
// and every t(...) call are left out of the code shown in the app.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ListNode,
  TreeNode,
  arrayToList,
  listToArray,
  arrayToTree,
  treeToArray,
  findNode,
  wait,
} from '../exercises/helpers.js';
import { fmt } from '../src/tracer.js';

const here = dirname(fileURLToPath(import.meta.url));
const exerciseDir = join(here, '../exercises');

// ---------- virtual clock so timer questions trace deterministically ----------
function makeClock() {
  let time = 0;
  let nextId = 0;
  const timers = [];
  return {
    get time() {
      return time;
    },
    setTimeout(fn, ms) {
      const id = ++nextId;
      timers.push({ id, at: time + ms, fn });
      return id;
    },
    clearTimeout(id) {
      const i = timers.findIndex((x) => x.id === id);
      if (i >= 0) timers.splice(i, 1);
    },
    advance(ms) {
      const end = time + ms;
      for (;;) {
        timers.sort((a, b) => a.at - b.at || a.id - b.id);
        const next = timers[0];
        if (!next || next.at > end) break;
        timers.shift();
        time = next.at;
        next.fn();
      }
      time = end;
    },
  };
}

// ---------- strip tracing from the source shown in the app ----------
function cleanSource(fn) {
  let src = fn.toString();
  src = src.slice(src.indexOf('{') + 1, src.lastIndexOf('}'));
  // remove whole t(...) statements, balancing parens so multi-line calls go too
  let out = '';
  for (let i = 0; i < src.length; ) {
    const lineStart = i === 0 || src[i - 1] === '\n';
    const m = lineStart && /^[ \t]*t\(/.exec(src.slice(i, i + 200));
    if (!m) {
      out += src[i++];
      continue;
    }
    let j = i + m[0].length;
    let d = 1;
    let quote = null;
    for (; j < src.length && d > 0; j++) {
      const c = src[j];
      if (quote) {
        if (c === '\\') j++;
        else if (c === quote) quote = null;
      } else if (c === "'" || c === '"' || c === '`') quote = c;
      else if (c === '(') d++;
      else if (c === ')') d--;
    }
    while (src[j] === ';' || src[j] === ' ') j++;
    if (src[j] === '\n') j++;
    i = j;
  }
  // also drop one-line `if (cond) t(...);` probes
  const lines = out.split('\n').filter((l) => !/\/\/ hide\s*$/.test(l) && !/^\s*if \(.*\) t\(.*\);\s*$/.test(l));
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}

const E = [];
const add = (id, input, expect, run) => E.push({ id, input, expect, run });

// ======================================================================
add('01-two-sum', 'nums = [2,7,11,15], target = 9', [0, 1], (t) => {
  function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
      const need = target - nums[i];
      t(seen.has(need) ? `${need} is in seen at ${seen.get(need)}, return` : `${need} not seen, store ${nums[i]}`, { i, 'nums[i]': nums[i], need, seen });
      if (seen.has(need)) return [seen.get(need), i];
      seen.set(nums[i], i);
    }
  }
  return twoSum([2, 7, 11, 15], 9);
});

add('02-group-anagrams', 'strs = ["eat","tea","tan","ate","nat","bat"]', [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']], (t) => {
  function groupAnagrams(strs) {
    const groups = new Map();
    for (const word of strs) {
      const key = [...word].sort().join('');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(word);
      t(`'${word}' sorts to '${key}'`, { word, key, groups });
    }
    return [...groups.values()];
  }
  return groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
});

add('03-longest-consecutive-sequence', 'nums = [100,4,200,1,3,2]', 4, (t) => {
  function longestConsecutive(nums) {
    const set = new Set(nums);
    let best = 0;
    for (const n of set) {
      if (set.has(n - 1)) {
        t(`${n - 1} exists, so ${n} is not a start`, { n, best });
        continue;
      }
      let len = 1;
      while (set.has(n + len)) len++;
      best = Math.max(best, len);
      t(`start at ${n}, run length ${len}`, { n, len, best });
    }
    return best;
  }
  return longestConsecutive([100, 4, 200, 1, 3, 2]);
});

add('04-3sum', 'nums = [-1,0,1,2,-1,-4]', [[-1, -1, 2], [-1, 0, 1]], (t) => {
  function threeSum(nums) {
    nums.sort((a, b) => a - b);
    t('sorted', { nums });
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) {
        t(`skip duplicate ${nums[i]}`, { i });
        continue;
      }
      let l = i + 1;
      let r = nums.length - 1;
      while (l < r) {
        const sum = nums[i] + nums[l] + nums[r];
        t(sum === 0 ? 'sum is 0, record it' : sum < 0 ? 'too small, move l right' : 'too big, move r left', { i, l, r, triple: [nums[i], nums[l], nums[r]], sum, res });
        if (sum < 0) l++;
        else if (sum > 0) r--;
        else {
          res.push([nums[i], nums[l], nums[r]]);
          l++;
          r--;
          while (l < r && nums[l] === nums[l - 1]) l++;
        }
      }
    }
    return res;
  }
  return threeSum([-1, 0, 1, 2, -1, -4]);
});

add('05-container-with-most-water', 'height = [1,8,6,2,5,4,8,3,7]', 49, (t) => {
  function maxArea(height) {
    let l = 0;
    let r = height.length - 1;
    let best = 0;
    while (l < r) {
      const area = Math.min(height[l], height[r]) * (r - l);
      best = Math.max(best, area);
      t(height[l] < height[r] ? 'left is shorter, l++' : 'right is shorter or equal, r--', { l, r, 'h[l]': height[l], 'h[r]': height[r], area, best });
      if (height[l] < height[r]) l++;
      else r--;
    }
    return best;
  }
  return maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]);
});

add('06-longest-substring-without-repeating-characters', 's = "abcabcbb"', 3, (t) => {
  function lengthOfLongestSubstring(s) {
    const last = new Map();
    let l = 0;
    let best = 0;
    for (let r = 0; r < s.length; r++) {
      const ch = s[r];
      if (last.has(ch) && last.get(ch) >= l) l = last.get(ch) + 1;
      last.set(ch, r);
      best = Math.max(best, r - l + 1);
      t(`add '${ch}'`, { r, ch, l, window: s.slice(l, r + 1), last, best });
    }
    return best;
  }
  return lengthOfLongestSubstring('abcabcbb');
});

add('07-permutation-in-string', 's1 = "ab", s2 = "eidbaooo"', true, (t) => {
  function checkInclusion(s1, s2) {
    const need = {};
    for (const c of s1) need[c] = (need[c] || 0) + 1;
    const have = {};
    let l = 0;
    for (let r = 0; r < s2.length; r++) {
      have[s2[r]] = (have[s2[r]] || 0) + 1;
      if (r - l + 1 > s1.length) {
        if (--have[s2[l]] === 0) delete have[s2[l]];
        l++;
      }
      const match = Object.keys(need).every((c) => have[c] === need[c]) && Object.keys(have).length === Object.keys(need).length;
      t(match ? 'counts match, return true' : 'no match, slide', { r, window: s2.slice(l, r + 1), have, need, match });
      if (match) return true;
    }
    return false;
  }
  return checkInclusion('ab', 'eidbaooo');
});

add('08-subarray-sum-equals-k', 'nums = [1,1,1], k = 2', 2, (t) => {
  function subarraySum(nums, k) {
    const seen = new Map([[0, 1]]);
    let prefix = 0;
    let count = 0;
    for (const n of nums) {
      prefix += n;
      count += seen.get(prefix - k) || 0;
      seen.set(prefix, (seen.get(prefix) || 0) + 1);
      t(`prefix ${prefix}, look up ${prefix - k}`, { n, prefix, 'prefix - k': prefix - k, count, seen });
    }
    return count;
  }
  return subarraySum([1, 1, 1], 2);
});

add('09-product-of-array-except-self', 'nums = [1,2,3,4]', [24, 12, 8, 6], (t) => {
  function productExceptSelf(nums) {
    const out = new Array(nums.length).fill(1);
    let prefix = 1;
    for (let i = 0; i < nums.length; i++) {
      out[i] = prefix;
      prefix *= nums[i];
      t('left pass: out[i] = product of everything left', { i, prefix, out });
    }
    let suffix = 1;
    for (let i = nums.length - 1; i >= 0; i--) {
      out[i] *= suffix;
      suffix *= nums[i];
      t('right pass: multiply by product of everything right', { i, suffix, out });
    }
    return out;
  }
  return productExceptSelf([1, 2, 3, 4]);
});

add('10-valid-parentheses', 's = "{[()]}"', true, (t) => {
  function isValid(s) {
    const pairs = { ')': '(', ']': '[', '}': '{' };
    const stack = [];
    for (const ch of s) {
      if (!pairs[ch]) {
        stack.push(ch);
        t(`open '${ch}', push`, { ch, stack });
      } else {
        const top = stack.pop();
        t(top === pairs[ch] ? `close '${ch}' matches '${top}', pop` : `close '${ch}' does not match, return false`, { ch, top, stack });
        if (top !== pairs[ch]) return false;
      }
    }
    return stack.length === 0;
  }
  return isValid('{[()]}');
});

add('11-min-stack', 'push -2, push 0, push -3, getMin, pop, top, getMin', [null, null, null, -3, null, 0, -2], (t) => {
  class MinStack {
    constructor() {
      this.stack = [];
      this.mins = [];
    }
    push(val) {
      this.stack.push(val);
      this.mins.push(Math.min(val, this.mins.length ? this.mins.at(-1) : val));
    }
    pop() {
      this.stack.pop();
      this.mins.pop();
    }
    top() {
      return this.stack.at(-1);
    }
    getMin() {
      return this.mins.at(-1);
    }
  }
  const s = new MinStack();
  const ops = [['push', -2], ['push', 0], ['push', -3], ['getMin'], ['pop'], ['top'], ['getMin']];
  const results = [];
  for (const [op, ...args] of ops) {
    const result = s[op](...args) ?? null;
    results.push(result);
    t(`${op}(${args.join(', ')})`, { stack: s.stack, mins: s.mins, result });
  }
  return results;
});

add('12-decode-string', 's = "3[a2[c]]"', 'accaccacc', (t) => {
  function decodeString(s) {
    const counts = [];
    const strs = [];
    let cur = '';
    let k = 0;
    for (const ch of s) {
      if (ch >= '0' && ch <= '9') k = k * 10 + Number(ch);
      else if (ch === '[') {
        counts.push(k);
        strs.push(cur);
        k = 0;
        cur = '';
      } else if (ch === ']') cur = strs.pop() + cur.repeat(counts.pop());
      else cur += ch;
      t(ch === '[' ? "'[' save k and cur, start fresh" : ch === ']' ? "']' repeat cur, join with saved" : /\d/.test(ch) ? 'digit, build k' : 'letter, append', { ch, k, cur, counts, strs });
    }
    return cur;
  }
  return decodeString('3[a2[c]]');
});

add('13-longest-valid-parentheses', 's = ")()())"', 4, (t) => {
  function longestValidParentheses(s) {
    const stack = [-1];
    let best = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') {
        stack.push(i);
        t("'(' push index", { i, ch: s[i], stack, best });
      } else {
        stack.pop();
        if (!stack.length) {
          stack.push(i);
          t("')' with nothing to match, new base", { i, ch: s[i], stack, best });
        } else {
          best = Math.max(best, i - stack.at(-1));
          t(`')' matched, length ${i - stack.at(-1)}`, { i, ch: s[i], stack, best });
        }
      }
    }
    return best;
  }
  return longestValidParentheses(')()())');
});

add('14-find-peak-element', 'nums = [1,2,1,3,5,6,4]', 5, (t) => {
  function findPeakElement(nums) {
    let lo = 0;
    let hi = nums.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      t(nums[mid] < nums[mid + 1] ? 'going uphill, peak is right: lo = mid + 1' : 'going downhill, peak is here or left: hi = mid', { lo, hi, mid, 'nums[mid]': nums[mid], 'nums[mid+1]': nums[mid + 1] });
      if (nums[mid] < nums[mid + 1]) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  return findPeakElement([1, 2, 1, 3, 5, 6, 4]);
});

add('15-search-in-rotated-sorted-array', 'nums = [4,5,6,7,0,1,2], target = 0', 4, (t) => {
  function search(nums, target) {
    let lo = 0;
    let hi = nums.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] === target) {
        t('found target', { lo, hi, mid, 'nums[mid]': nums[mid] });
        return mid;
      }
      if (nums[lo] <= nums[mid]) {
        const inLeft = nums[lo] <= target && target < nums[mid];
        t(`left half sorted, target ${inLeft ? 'inside it' : 'not in it'}`, { lo, hi, mid, 'nums[mid]': nums[mid] });
        if (inLeft) hi = mid - 1;
        else lo = mid + 1;
      } else {
        const inRight = nums[mid] < target && target <= nums[hi];
        t(`right half sorted, target ${inRight ? 'inside it' : 'not in it'}`, { lo, hi, mid, 'nums[mid]': nums[mid] });
        if (inRight) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return -1;
  }
  return search([4, 5, 6, 7, 0, 1, 2], 0);
});

add('16-koko-eating-bananas', 'piles = [3,6,7,11], h = 8', 4, (t) => {
  function minEatingSpeed(piles, h) {
    let lo = 1;
    let hi = Math.max(...piles);
    while (lo < hi) {
      const k = Math.floor((lo + hi) / 2);
      const hours = piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);
      t(hours <= h ? `speed ${k} fits (${hours}h), try slower` : `speed ${k} too slow (${hours}h), go faster`, { lo, hi, k, hours });
      if (hours <= h) hi = k;
      else lo = k + 1;
    }
    return lo;
  }
  return minEatingSpeed([3, 6, 7, 11], 8);
});

add('17-merge-intervals', 'intervals = [[1,3],[2,6],[8,10],[15,18]]', [[1, 6], [8, 10], [15, 18]], (t) => {
  function merge(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const res = [intervals[0]];
    t('start with the first interval', { res });
    for (const cur of intervals.slice(1)) {
      const last = res.at(-1);
      const overlaps = cur[0] <= last[1];
      if (overlaps) last[1] = Math.max(last[1], cur[1]);
      else res.push(cur);
      t(overlaps ? 'overlaps last, extend it' : 'no overlap, push', { cur, last, res });
    }
    return res;
  }
  return merge([[1, 3], [2, 6], [8, 10], [15, 18]]);
});

add('18-add-two-numbers', 'l1 = [2,4,3], l2 = [5,6,4]', [7, 0, 8], (t) => {
  function addTwoNumbers(l1, l2) {
    const dummy = new ListNode();
    let cur = dummy;
    let carry = 0;
    while (l1 || l2 || carry) {
      const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
      carry = Math.floor(sum / 10);
      cur.next = new ListNode(sum % 10);
      cur = cur.next;
      t(`write ${sum % 10}, carry ${carry}`, { 'l1.val': l1?.val, 'l2.val': l2?.val, sum, carry, result: dummy.next });
      l1 = l1?.next;
      l2 = l2?.next;
    }
    return dummy.next;
  }
  return listToArray(addTwoNumbers(arrayToList([2, 4, 3]), arrayToList([5, 6, 4])));
});

add('19-lru-cache', 'capacity 2: put(1,1) put(2,2) get(1) put(3,3) get(2) put(4,4) get(1) get(3) get(4)', [null, null, 1, null, -1, null, -1, 3, 4], (t) => {
  class LRUCache {
    constructor(capacity) {
      this.capacity = capacity;
      this.map = new Map(); // oldest key first
    }
    get(key) {
      if (!this.map.has(key)) return -1;
      const val = this.map.get(key);
      this.map.delete(key);
      this.map.set(key, val);
      return val;
    }
    put(key, val) {
      this.map.delete(key);
      this.map.set(key, val);
      if (this.map.size > this.capacity) this.map.delete(this.map.keys().next().value);
    }
  }
  const cache = new LRUCache(2);
  const ops = [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]];
  const results = [];
  for (const [op, ...args] of ops) {
    const result = cache[op](...args) ?? null;
    results.push(result);
    t(`${op}(${args.join(', ')})`, { 'map (oldest first)': cache.map, result });
  }
  return results;
});

add('20-binary-tree-level-order-traversal', 'root = [3,9,20,null,null,15,7]', [[3], [9, 20], [15, 7]], (t) => {
  function levelOrder(root) {
    const res = [];
    const queue = root ? [root] : [];
    while (queue.length) {
      const size = queue.length;
      const level = [];
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        level.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
        t(`visit ${node.val}, queue its children`, { size, node, level, queue, res });
      }
      res.push(level);
    }
    return res;
  }
  return levelOrder(arrayToTree([3, 9, 20, null, null, 15, 7]));
});

add('21-lowest-common-ancestor-of-a-binary-tree', 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', 3, (t) => {
  const root = arrayToTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
  const p = findNode(root, 5);
  const q = findNode(root, 1);
  function lca(node) {
    if (!node || node === p || node === q) {
      if (node) t(`hit ${node.val}, return it`, { node, returns: node });
      return node;
    }
    const left = lca(node.left);
    const right = lca(node.right);
    const result = left && right ? node : left || right;
    t(left && right ? `both sides found, ${node.val} is the answer` : `back at ${node.val}, pass up what was found`, { node, left, right, returns: result });
    return result;
  }
  return lca(root).val;
});

add('22-construct-binary-tree-from-preorder-and-inorder-traversal', 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', [3, 9, 20, null, null, 15, 7], (t) => {
  function buildTree(preorder, inorder) {
    const index = new Map(inorder.map((v, i) => [v, i]));
    let pi = 0;
    function build(lo, hi) {
      if (lo > hi) return null;
      const val = preorder[pi++];
      const mid = index.get(val);
      t(`next preorder value ${val} is the root`, { pi, val, mid, range: inorder.slice(lo, hi + 1), left: inorder.slice(lo, mid), right: inorder.slice(mid + 1, hi + 1) });
      const node = new TreeNode(val);
      node.left = build(lo, mid - 1);
      node.right = build(mid + 1, hi);
      return node;
    }
    return build(0, inorder.length - 1);
  }
  return treeToArray(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]));
});

add('23-number-of-islands', 'grid = 11000 / 11000 / 00100 / 00011', 3, (t) => {
  function numIslands(grid) {
    let count = 0;
    function sink(r, c) {
      if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;
      grid[r][c] = '0';
      sink(r + 1, c);
      sink(r - 1, c);
      sink(r, c + 1);
      sink(r, c - 1);
    }
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === '1') {
          count++;
          sink(r, c);
          t(`land at (${r},${c}): island ${count}, sink it`, { r, c, count, grid: grid.map((row) => row.join('')).join(' / ') });
        }
      }
    }
    return count;
  }
  const grid = ['11000', '11000', '00100', '00011'].map((row) => [...row]);
  return numIslands(grid);
});

add('24-top-k-frequent-elements', 'nums = [1,1,1,2,2,3], k = 2', [1, 2], (t) => {
  function topKFrequent(nums, k) {
    const freq = new Map();
    for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
    t('count each number', { freq });
    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [n, f] of freq) buckets[f].push(n);
    t('bucket index = frequency', { buckets });
    const res = [];
    for (let f = buckets.length - 1; f > 0 && res.length < k; f--) {
      res.push(...buckets[f]);
      if (buckets[f].length) t(`take bucket ${f}`, { f, 'buckets[f]': buckets[f], res });
    }
    return res.slice(0, k);
  }
  return topKFrequent([1, 1, 1, 2, 2, 3], 2);
});

add('25-word-break', 's = "leetcode", wordDict = ["leet","code"]', true, (t) => {
  function wordBreak(s, wordDict) {
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++) {
      for (const w of wordDict) {
        if (i >= w.length && dp[i - w.length] && s.slice(i - w.length, i) === w) {
          dp[i] = true;
          break;
        }
      }
      t(dp[i] ? `'${s.slice(0, i)}' can be built` : `'${s.slice(0, i)}' cannot be built yet`, { i, prefix: s.slice(0, i), 'dp (T/F per length)': dp.map((x) => (x ? 'T' : 'F')).join('') });
    }
    return dp[s.length];
  }
  return wordBreak('leetcode', ['leet', 'code']);
});

// ---------- JavaScript ----------
add('26-debounce', 'd = debounce(fn, 50); d(1) at 0ms, d(2) at 20ms, d(3) at 40ms', [3], (t) => {
  const clock = makeClock(); // hide
  const { setTimeout, clearTimeout, advance } = clock; // hide
  function debounce(fn, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
      t(`d(${args}) at ${clock.time}ms: clear old timer, set new one`, { now: clock.time, args, timer, 'fires at': clock.time + wait, calls });
    };
  }
  const calls = [];
  const d = debounce((x) => {
    calls.push(x);
    t(`timer fires at ${clock.time}ms, fn(${x}) runs`, { now: clock.time, calls });
  }, 50);
  d(1);
  advance(20); // 20ms pass
  d(2);
  advance(20);
  d(3);
  advance(60);
  return calls;
});

add('27-throttle', 't = throttle(fn, 50); calls at 0, 10, 20, 70, 80ms', [1, 4], (t) => {
  const clock = makeClock(); // hide
  const Date = { now: () => clock.time }; // hide
  const advance = clock.advance; // hide
  function throttle(fn, wait) {
    let last = -Infinity;
    return function (...args) {
      const now = Date.now();
      const ran = now - last >= wait;
      if (ran) {
        last = now;
        fn.apply(this, args);
      }
      t(ran ? `call(${args}) at ${now}ms runs` : `call(${args}) at ${now}ms ignored, only ${now - last}ms since last run`, { now, args, last, ran, calls });
    };
  }
  const calls = [];
  const th = throttle((x) => calls.push(x), 50);
  th(1);
  advance(10);
  th(2);
  advance(10);
  th(3);
  advance(50);
  th(4);
  advance(10);
  th(5);
  return calls;
});

add('28-memoize', "m = memoize(add); m(1,2), m(1,2), m(2,1), m('1',2)", [3, 3, 3, '12'], (t) => {
  function memoize(fn) {
    const cache = new Map();
    return function (...args) {
      const key = JSON.stringify(args);
      const hit = cache.has(key);
      if (!hit) cache.set(key, fn.apply(this, args));
      t(hit ? `cache hit for ${key}` : `miss for ${key}, call fn and store`, { key, hit, cache });
      return cache.get(key);
    };
  }
  const m = memoize((a, b) => a + b);
  return [m(1, 2), m(1, 2), m(2, 1), m('1', 2)];
});

add('29-curry', 'curry((a,b,c) => a+b+c)(1)(2)(3), (1,2)(3); sum(1)(2)(3)()', [6, 6, 6], (t) => {
  function curry(fn) {
    return function curried(...args) {
      t(args.length >= fn.length ? `${args.length} of ${fn.length} args, call fn` : `${args.length} of ${fn.length} args, return a function for more`, { args, 'fn.length': fn.length });
      if (args.length >= fn.length) return fn(...args);
      return (...more) => curried(...args, ...more);
    };
  }
  function sum(a) {
    return function next(b) {
      t(b === undefined ? 'called with nothing, return total' : `add ${b}`, { a, b });
      if (b === undefined) return a;
      a += b;
      return next;
    };
  }
  const add3 = curry((a, b, c) => a + b + c);
  return [add3(1)(2)(3), add3(1, 2)(3), sum(1)(2)(3)()];
});

add('30-once', 'init = once(x => x * 2); init(5), init(9)', [10, 10], (t) => {
  function once(fn) {
    let done = false;
    let result;
    return function (...args) {
      const first = !done;
      if (!done) {
        done = true;
        result = fn.apply(this, args);
      }
      t(first ? `first call (${args}): run fn, save result` : `later call (${args}): return saved result`, { args, done, result });
      return result;
    };
  }
  const init = once((x) => x * 2);
  return [init(5), init(9)];
});

add('31-pipe-and-compose', 'pipe(add1, double, square)(2), compose(add1, double, square)(2)', [36, 9], (t) => {
  function pipe(...fns) {
    return (x) =>
      fns.reduce((value, fn) => {
        const next = fn(value);
        t(`pipe: ${fn.name}(${value})`, { value, fn: fn.name, next });
        return next;
      }, x);
  }
  function compose(...fns) {
    return (x) =>
      fns.reduceRight((value, fn) => {
        const next = fn(value);
        t(`compose: ${fn.name}(${value})`, { value, fn: fn.name, next });
        return next;
      }, x);
  }
  const add1 = (x) => x + 1;
  const double = (x) => x * 2;
  const square = (x) => x * x;
  return [pipe(add1, double, square)(2), compose(add1, double, square)(2)];
});

add('32-map-filter-reduce-polyfill', '[1,2,3].myMap(x => x * 2), [1,2,3,4].myReduce((a, b) => a + b)', [[2, 4, 6], 10], (t) => {
  Array.prototype.myMap = function (callback) {
    const out = [];
    for (let i = 0; i < this.length; i++) {
      out.push(callback(this[i], i, this));
      t(`map: index ${i}`, { i, 'this[i]': this[i], out });
    }
    return out;
  };
  Array.prototype.myReduce = function (callback, initialValue) {
    let i = 0;
    let acc = initialValue;
    if (arguments.length < 2) {
      if (!this.length) throw new TypeError('Reduce of empty array with no initial value');
      acc = this[0];
      i = 1;
      t('reduce: no initial value, start from this[0]', { i, acc });
    }
    for (; i < this.length; i++) {
      acc = callback(acc, this[i], i, this);
      t(`reduce: index ${i}`, { i, 'this[i]': this[i], acc });
    }
    return acc;
  };
  return [[1, 2, 3].myMap((x) => x * 2), [1, 2, 3, 4].myReduce((a, b) => a + b)];
});

add('33-call-apply-bind-polyfill', "greet.myCall(person, 'Hi', '!'), greet.myBind(person, 'Hey')('?')", ['Hi, Asha!', 'Hey, Asha?'], (t) => {
  Function.prototype.myCall = function (thisArg, ...args) {
    const ctx = thisArg ?? globalThis;
    const key = Symbol('fn');
    ctx[key] = this;
    t('myCall: put the function on thisArg under a symbol', { ctx, args });
    const result = ctx[key](...args);
    delete ctx[key];
    t('myCall: call it as ctx[key](), so this = ctx, then delete it', { ctx, result });
    return result;
  };
  Function.prototype.myBind = function (thisArg, ...args) {
    const fn = this;
    t('myBind: remember fn, thisArg and the first args', { fn, thisArg, args });
    return function (...more) {
      t('bound function called: join old and new args', { args, more });
      return fn.myCall(thisArg, ...args, ...more);
    };
  };
  function greet(greeting, mark) {
    return `${greeting}, ${this.name}${mark}`;
  }
  const person = { name: 'Asha' };
  return [greet.myCall(person, 'Hi', '!'), greet.myBind(person, 'Hey')('?')];
});

add('34-promise-all-polyfill', 'promiseAll([later(1, 30ms), later(2, 10ms), 3])', [1, 2, 3], async (t) => {
  const later = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
  function promiseAll(items) {
    return new Promise((resolve, reject) => {
      const out = [];
      let left = items.length;
      if (!left) return resolve(out);
      items.forEach((item, i) => {
        Promise.resolve(item).then((value) => {
          out[i] = value;
          left--;
          t(left === 0 ? `item ${i} resolved, none left: resolve(out)` : `item ${i} resolved, store at index ${i}`, { i, value, left, out });
          if (left === 0) resolve(out);
        }, reject);
      });
    });
  }
  return await promiseAll([later(1, 30), later(2, 10), 3]);
});

add('35-promise-allsettled-race-any', "promiseAllSettled([later(1, 20ms), fail('x', 10ms)]), promiseAny([fail('a', 5ms), later('b', 25ms), fail('c', 15ms)])", [[{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'x' }], 'b'], async (t) => {
  const later = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
  const fail = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));
  function promiseAllSettled(items) {
    return new Promise((resolve) => {
      const out = [];
      let left = items.length;
      items.forEach((item, i) => {
        Promise.resolve(item)
          .then(
            (value) => (out[i] = { status: 'fulfilled', value }),
            (reason) => (out[i] = { status: 'rejected', reason }),
          )
          .then(() => {
            left--;
            t(`allSettled: item ${i} settled`, { i, left, out });
            if (left === 0) resolve(out);
          });
      });
    });
  }
  function promiseAny(items) {
    return new Promise((resolve, reject) => {
      const errors = [];
      let left = items.length;
      items.forEach((item, i) => {
        Promise.resolve(item).then(
          (value) => {
            t(`any: item ${i} fulfilled, resolve with it`, { i, value, errors, left });
            resolve(value);
          },
          (e) => {
            errors[i] = e;
            left--;
            t(`any: item ${i} rejected, keep the error`, { i, error: e, errors, left });
            if (left === 0) reject(new AggregateError(errors, 'All promises were rejected'));
          },
        );
      });
    });
  }
  const settled = await promiseAllSettled([later(1, 20), fail('x', 10)]);
  const any = await promiseAny([fail('a', 5), later('b', 25), fail('c', 15)]);
  return [settled, any];
});

add('36-promise-pool', 'tasks take 60, 20, 50, 20ms; limit = 2', [1, 2, 3, 4], async (t) => {
  const task = (value, ms) => () => new Promise((resolve) => setTimeout(() => resolve(value), ms));
  async function promisePool(tasks, limit) {
    const out = [];
    let next = 0;
    async function worker(w) {
      while (next < tasks.length) {
        const i = next++;
        t(`worker ${w} starts task ${i}`, { worker: w, i, next, out });
        out[i] = await tasks[i]();
        t(`worker ${w} finished task ${i}`, { worker: w, i, next, out });
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, (_, w) => worker(w)));
    return out;
  }
  return await promisePool([task(1, 60), task(2, 20), task(3, 50), task(4, 20)], 2);
});

add('37-retry', 'fn fails twice then returns ok; retry(fn, 3, 10ms)', 'ok', async (t) => {
  let attempts = 0;
  const flaky = async () => {
    attempts++;
    if (attempts <= 2) throw new Error('fail ' + attempts);
    return 'ok';
  };
  async function retry(fn, times, delay) {
    for (let attempt = 1; ; attempt++) {
      try {
        const result = await fn();
        t(`attempt ${attempt} succeeded`, { attempt, times, result });
        return result;
      } catch (e) {
        t(attempt >= times ? `attempt ${attempt} failed, no tries left: throw` : `attempt ${attempt} failed, wait ${delay}ms`, { attempt, times, error: e.message });
        if (attempt >= times) throw e;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  return await retry(flaky, 3, 10);
});

add('38-sleep-and-event-loop', "push A; setTimeout(B); Promise.then(C); queueMicrotask(D); push E", ['A', 'E', 'C', 'D', 'B'], async (t) => {
  const order = [];
  order.push('A');
  t('sync code runs first: push A', { order, microtasks: [], tasks: [] });
  setTimeout(() => {
    order.push('B');
    t('task queue runs last: push B', { order, microtasks: [], tasks: [] });
  }, 0);
  t('setTimeout puts B in the task queue', { order, microtasks: [], tasks: ['B'] });
  Promise.resolve().then(() => {
    order.push('C');
    t('stack empty, run microtasks first: push C', { order, microtasks: ['D'], tasks: ['B'] });
  });
  t('.then puts C in the microtask queue', { order, microtasks: ['C'], tasks: ['B'] });
  queueMicrotask(() => {
    order.push('D');
    t('next microtask: push D', { order, microtasks: [], tasks: ['B'] });
  });
  t('queueMicrotask puts D in the microtask queue', { order, microtasks: ['C', 'D'], tasks: ['B'] });
  order.push('E');
  t('still sync: push E', { order, microtasks: ['C', 'D'], tasks: ['B'] });
  await wait(10); // hide
  return order;
});

add('39-setinterval-with-settimeout', 'mySetInterval(tick, 20); clear at 70ms; wait 50ms more', 3, (t) => {
  const clock = makeClock(); // hide
  const { setTimeout, clearTimeout, advance } = clock; // hide
  function mySetInterval(fn, ms) {
    const id = { timer: null, stopped: false };
    const tick = () => {
      id.timer = setTimeout(() => {
        fn();
        if (!id.stopped) tick();
      }, ms);
    };
    tick();
    return id;
  }
  function myClearInterval(id) {
    id.stopped = true;
    clearTimeout(id.timer);
  }
  let n = 0;
  const id = mySetInterval(() => {
    n++;
    t(`tick at ${clock.time}ms, schedule the next one`, { now: clock.time, n, 'timer id': id.timer });
  }, 20);
  advance(70);
  myClearInterval(id);
  t('myClearInterval: stop flag on, pending timer cleared', { now: clock.time, n, stopped: id.stopped });
  advance(50);
  t('50ms later: nothing ran', { now: clock.time, n });
  return n;
});

add('40-flatten-array', 'flat([1, [2, [3, [4]]]], 2)', [1, 2, 3, [4]], (t) => {
  function flat(arr, depth = 1) {
    const out = [];
    for (const x of arr) {
      if (Array.isArray(x) && depth > 0) {
        t(`array: go inside with depth ${depth - 1}`, { x, depth, out });
        out.push(...flat(x, depth - 1));
        t('back: spread its result into out', { x, depth, out });
      } else {
        out.push(x);
        t(Array.isArray(x) ? 'array but depth 0: keep as is' : 'value: push', { x, depth, out });
      }
    }
    return out;
  }
  return flat([1, [2, [3, [4]]]], 2);
});

add('41-flatten-object', 'flattenObject({ a: { b: 1, c: { d: 2 } }, e: 3 })', { 'a.b': 1, 'a.c.d': 2, e: 3 }, (t) => {
  function flattenObject(obj, prefix = '', out = {}) {
    for (const key in obj) {
      const path = prefix ? prefix + '.' + key : key;
      const value = obj[key];
      const nested = value && typeof value === 'object';
      t(nested ? `'${path}' is an object, go inside` : `'${path}' is a value, store it`, { prefix, key, path, value, out: nested ? out : { ...out, [path]: value } });
      if (nested) flattenObject(value, path, out);
      else out[path] = value;
    }
    return out;
  }
  return flattenObject({ a: { b: 1, c: { d: 2 } }, e: 3 });
});

add('42-deep-clone', "obj = { name: 'loop', tags: ['x'] }; obj.self = obj; deepClone(obj)", [true, true], (t) => {
  function deepClone(value, seen = new WeakMap()) {
    if (value === null || typeof value !== 'object') return value;
    if (value instanceof Date) return new Date(value);
    if (seen.has(value)) {
      t('already copied this object: reuse the copy (handles the cycle)', { value, copy: seen.get(value) });
      return seen.get(value);
    }
    const copy = Array.isArray(value) ? [] : {};
    seen.set(value, copy);
    t(`new ${Array.isArray(value) ? 'array' : 'object'}: register copy in seen before recursing`, { value, copy });
    for (const key of Object.keys(value)) {
      copy[key] = deepClone(value[key], seen);
      t(`copied key '${key}'`, { key, copy });
    }
    return copy;
  }
  const obj = { name: 'loop', tags: ['x'] };
  obj.self = obj;
  const c = deepClone(obj);
  return [c.self === c, c !== obj];
});

add('43-deep-equal', 'isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] })', false, (t) => {
  function isEqual(a, b) {
    if (Object.is(a, b)) {
      t('same value', { a, b, returns: true });
      return true;
    }
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
      t('different and not both objects', { a, b, returns: false });
      return false;
    }
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    t('both objects: compare key counts, then each key', { a, b, keysA, keysB });
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) => Object.hasOwn(b, k) && isEqual(a[k], b[k]));
  }
  return isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] });
});

add('44-get-by-path', "get({ a: { b: [{ c: 5 }] } }, 'a.b[0].c')", 5, (t) => {
  function get(obj, path, defaultValue) {
    const keys = Array.isArray(path) ? path : path.replace(/\[(\w+)\]/g, '.$1').split('.');
    t('turn [0] into .0, split on dots', { path, keys });
    let cur = obj;
    for (const key of keys) {
      if (cur == null) return defaultValue;
      cur = cur[key];
      t(`step into '${key}'`, { key, cur });
    }
    return cur === undefined ? defaultValue : cur;
  }
  return get({ a: { b: [{ c: 5 }] } }, 'a.b[0].c');
});

add('45-event-emitter', "on('hi', a), on('hi', b), emit('hi', 1), off('hi', a), emit('hi', 2), once('bye', c), emit('bye', 1), emit('bye', 2)", ['a1', 'b1', 'b2', 'c1'], (t) => {
  class EventEmitter {
    constructor() {
      this.events = {};
    }
    on(event, listener) {
      (this.events[event] ??= []).push(listener);
      return this;
    }
    off(event, listener) {
      this.events[event] = (this.events[event] ?? []).filter((l) => l !== listener && l.listener !== listener);
      return this;
    }
    emit(event, ...args) {
      const listeners = this.events[event];
      if (!listeners?.length) return false;
      [...listeners].forEach((l) => l.apply(this, args));
      return true;
    }
    once(event, listener) {
      const wrapper = (...args) => {
        this.off(event, wrapper);
        listener.apply(this, args);
      };
      wrapper.listener = listener;
      return this.on(event, wrapper);
    }
  }
  const log = [];
  const a = (x) => log.push('a' + x);
  const b = (x) => log.push('b' + x);
  const c = (x) => log.push('c' + x);
  const e = new EventEmitter();
  const ops = [['on', 'hi', a], ['on', 'hi', b], ['emit', 'hi', 1], ['off', 'hi', a], ['emit', 'hi', 2], ['once', 'bye', c], ['emit', 'bye', 1], ['emit', 'bye', 2]];
  for (const [op, event, arg] of ops) {
    e[op](event, arg);
    t(`${op}('${event}', ${typeof arg === 'function' ? arg.name : arg})`, { events: e.events, log });
  }
  return log;
});

// ======================================================================
const folders = readdirSync(exerciseDir).filter((d) => /^\d\d-/.test(d)).sort();
const missing = folders.filter((f) => !E.some((e) => e.id === f));
if (missing.length) throw new Error('No trace for: ' + missing.join(', '));

const out = [];
for (const e of E) {
  const header = readFileSync(join(exerciseDir, e.id, 'index.js'), 'utf8').split('\n')[1];
  const [, n, title] = header.match(/^ \* (\d+)\. (.+)$/);
  const steps = [];
  const t = (note, vars) => {
    const vals = {};
    for (const [k, v] of Object.entries(vars)) vals[k] = fmt(v);
    steps.push({ note, vals });
  };
  const result = await e.run(t);
  if (JSON.stringify(result) !== JSON.stringify(e.expect)) {
    throw new Error(`${e.id}: expected ${JSON.stringify(e.expect)}, got ${JSON.stringify(result)}`);
  }
  const cols = [...new Set(steps.flatMap((s) => Object.keys(s.vals)))];
  out.push({ id: e.id, n: Number(n), title, input: e.input, output: fmt(result), code: cleanSource(e.run), cols, steps });
}

writeFileSync(join(here, '../src/generated/traces.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`wrote ${out.length} traces, ${out.reduce((s, x) => s + x.steps.length, 0)} steps, all outputs match`);
