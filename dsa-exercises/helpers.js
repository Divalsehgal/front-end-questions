// Shared helpers for the exercises. Run any exercise with: node exercise/01-two-sum/index.js

export function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) {
    console.log(`      expected ${JSON.stringify(expected)}`);
    console.log(`      got      ${JSON.stringify(actual)}`);
  }
}

// For answers that may come back in any order: sorts inner arrays, then the outer array.
export function unordered(value) {
  if (!Array.isArray(value)) return value;
  return value
    .map((x) => (Array.isArray(x) ? [...x].sort() : x))
    .sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
}

// ---------- linked list ----------
export class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

export function arrayToList(arr) {
  const dummy = new ListNode();
  let cur = dummy;
  for (let i = 0; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
  }
  return dummy.next;
}

export function listToArray(head) {
  const out = [];
  while (head) {
    out.push(head.val);
    head = head.next;
  }
  return out;
}

// ---------- binary tree (LeetCode level-order format, null = missing child) ----------
export class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export function arrayToTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

export function treeToArray(root) {
  const out = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) {
      out.push(node.val);
      queue.push(node.left, node.right);
    } else {
      out.push(null);
    }
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

export function findNode(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) || findNode(root.right, val);
}

// ---------- async ----------
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Keeps a missing .catch in an unfinished solution from crashing the whole file.
globalThis.process?.on('unhandledRejection', (reason) => console.log(`      unhandled rejection: ${reason}`));
