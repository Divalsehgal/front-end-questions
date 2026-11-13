// The pattern tree. Source: "Interview Prep" sheet (LeetCode Questions, Pattern, Notion Theory).
// A node with `url` is a question (gets a checkbox). Any node can carry spot/memory/steps/code.
export type Node = {
  name: string;
  memory?: string; // one line shown on the node
  spot?: string; // when to use
  steps?: string[];
  code?: string;
  url?: string;
  children?: Node[];
};

export const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`;
