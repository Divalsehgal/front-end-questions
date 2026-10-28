export class TreeNode {
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(public value: number) {}
}

export class BST {
  root: TreeNode | null = null;

  insert(value: number): void {
    const newNode = new TreeNode(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  private insertNode(root: TreeNode, newNode: TreeNode): void {
    if (newNode.value < root.value) {
      if (root.left === null) root.left = newNode;
      else this.insertNode(root.left, newNode);
    } else {
      if (root.right === null) root.right = newNode;
      else this.insertNode(root.right, newNode);
    }
  }

  has(value: number): boolean {
    let current = this.root;
    while (current) {
      if (current.value === value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }

  // The smallest value is all the way left, the biggest all the way right.
  min(): number | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.left) current = current.left;
    return current.value;
  }

  max(): number | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.right) current = current.right;
    return current.value;
  }

  inOrder(): number[] {
    const result: number[] = [];
    function walk(node: TreeNode | null) {
      if (!node) return;
      walk(node.left);
      result.push(node.value); // left, ROOT, right → sorted order
      walk(node.right);
    }
    walk(this.root);
    return result;
  }

  preOrder(): number[] {
    const result: number[] = [];
    function walk(node: TreeNode | null) {
      if (!node) return;
      result.push(node.value); // ROOT, left, right
      walk(node.left);
      walk(node.right);
    }
    walk(this.root);
    return result;
  }

  // BFS with a queue, one level at a time.
  levelOrder(): number[][] {
    const result: number[][] = [];
    if (!this.root) return result;
    let queue: TreeNode[] = [this.root];
    while (queue.length > 0) {
      const values: number[] = [];
      const nextQueue: TreeNode[] = [];
      for (const node of queue) {
        values.push(node.value);
        if (node.left) nextQueue.push(node.left);
        if (node.right) nextQueue.push(node.right);
      }
      result.push(values);
      queue = nextQueue;
    }
    return result;
  }

  height(): number {
    function getHeight(node: TreeNode | null): number {
      if (!node) return 0;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
    return getHeight(this.root);
  }

  delete(value: number): void {
    this.root = this.deleteNode(this.root, value);
  }

  private deleteNode(node: TreeNode | null, value: number): TreeNode | null {
    if (!node) return null;
    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // Found it. With 0 or 1 child, the child takes its place.
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      // With 2 children: copy the smallest value on the right, then delete that one.
      let smallest = node.right;
      while (smallest.left) smallest = smallest.left;
      node.value = smallest.value;
      node.right = this.deleteNode(node.right, smallest.value);
    }
    return node;
  }
}
