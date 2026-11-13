// Types for helpers.js so the app can load it.
export function check(label: string, actual: unknown, expected: unknown): void;
export function unordered<T>(value: T): T;
export class ListNode {
  constructor(val?: number, next?: ListNode | null);
  val: number;
  next: ListNode | null;
}
export function arrayToList(arr: number[]): ListNode | null;
export function listToArray(head: ListNode | null): number[];
export class TreeNode {
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null);
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}
export function arrayToTree(arr: (number | null)[]): TreeNode | null;
export function treeToArray(root: TreeNode | null): (number | null)[];
export function findNode(root: TreeNode | null, val: number): TreeNode | null;
export function wait(ms: number): Promise<void>;
