export class TreeNode {
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(public value: number) {}
}

/** Binary search tree. Duplicates go to the right. */
export class BST {
  root: TreeNode | null = null;

  insert(value: number): void {
    // your code
  }
  has(value: number): boolean {
    // your code
  }
  min(): number | null {
    // your code
  }
  max(): number | null {
    // your code
  }
  /** Values in sorted order. */
  inOrder(): number[] {
    // your code
  }
  preOrder(): number[] {
    // your code
  }
  /** Level by level, left to right (BFS). */
  levelOrder(): number[][] {
    // your code
  }
  height(): number {
    // your code (empty tree = 0, single node = 1)
  }
  delete(value: number): void {
    // your code
  }
}
