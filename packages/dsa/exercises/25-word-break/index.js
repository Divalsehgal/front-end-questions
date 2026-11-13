/**
 * 25. Word Break
 * https://leetcode.com/problems/word-break/
 *
 * Return true if s can be split into a sequence of one or more words from wordDict.
 * A word may be reused any number of times.
 *
 * Examples
 *   s = "leetcode", wordDict = ["leet","code"]                     ->  true
 *   s = "applepenapple", wordDict = ["apple","pen"]                ->  true
 *   s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]  ->  false
 *
 * Target complexity: Time O(n^2), Space O(n)
 */
import { check } from '../helpers.js';

function wordBreak(s, wordDict) {
  // your solution
}

check('example 1', wordBreak('leetcode', ['leet', 'code']), true);
check('reuse word', wordBreak('applepenapple', ['apple', 'pen']), true);
check('example 3', wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']), false);
