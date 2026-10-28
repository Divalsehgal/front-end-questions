// At each house: skip it (keep the best so far) or rob it (best from two houses back + this one).
export function rob(nums: number[]): number {
  let twoBack = 0;
  let oneBack = 0;
  for (const money of nums) {
    const current = Math.max(oneBack, twoBack + money);
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

// i is the day we buy (the lowest price so far), j is the day we sell.
export function maxProfit(prices: number[]): number {
  let i = 0;
  let best = 0;
  for (let j = 1; j < prices.length; j++) {
    if (prices[j] > prices[i]) {
      best = Math.max(best, prices[j] - prices[i]);
    } else {
      i = j; // found a cheaper day to buy
    }
  }
  return best;
}

// dp[a] = the fewest coins that make amount a.
export function coinChange(coins: number[], amount: number): number {
  const dp: number[] = [0];
  for (let a = 1; a <= amount; a++) {
    dp[a] = Infinity;
    for (const coin of coins) {
      if (coin <= a) {
        dp[a] = Math.min(dp[a], dp[a - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// dp[i] = the longest increasing subsequence that ends at i. O(n²).
export function lengthOfLIS(nums: number[]): number {
  const dp: number[] = [];
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    dp[i] = 1;
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}
