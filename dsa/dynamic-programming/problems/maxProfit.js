var maxProfit = function (prices) {
  let i = 0,
    maxProfit = 0;
  let j = 1;
  while (j <= prices.length - 1) {
    if (prices[j] > prices[i]) {
      let profit = prices[j] - prices[i];
      maxProfit = Math.max(profit, maxProfit);
    } else {
      i = j;
    }
    j++;
  }
  return maxProfit;
};

console.log(maxProfit([2, 1, 4]));
