class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    isEmpty() {
        return this.root === null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (this.isEmpty()) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(root, newNode) {
        if (newNode.value < root.value) {
            if (root.left === null) {
                root.left = newNode;
            } else {
                this.insertNode(root.left, newNode);
            }
        } else {
            if (root.right === null) {
                root.right = newNode;
            } else {
                this.insertNode(root.right, newNode);
            }
        }
    }

    search(root, value) {
        if (!root) {
            return false;
        }
        if (root.value === value) {
            return true;
        } else if (value < root.value) {
            return this.search(root.left, value);
        } else {
            return this.search(root.right, value);
        }
    }

    min(root) {
        if (!root || !root.left) {
            return root ? root.value : null;
        } else {
            return this.min(root.left);
        }
    }

    max(root) {
        if (!root || !root.right) {
            return root ? root.value : null;
        } else {
            return this.max(root.right);
        }
    }

    delete(value) {
        this.root = this.deleteNode(this.root, value);
    }

    deleteNode(root, value) {
        if (root === null) {
            return root;
        }
        if (value < root.value) {
            root.left = this.deleteNode(root.left, value);
        } else if (value > root.value) {
            root.right = this.deleteNode(root.right, value);
        } else {
            if (!root.left && !root.right) {
                return null;
            }
            if (!root.left) {
                return root.right;
            } else if (!root.right) {
                return root.left;
            }
            root.value = this.min(root.right);
            root.right = this.deleteNode(root.right, root.value);
        }
        return root;
    }

    inOrder(root) {
        if (root) {
            this.inOrder(root.left);
            console.log(root.value);
            this.inOrder(root.right);
        }
    }

    preOrder(root) {
        if (root) {
            console.log(root.value);
            this.preOrder(root.left);
            this.preOrder(root.right);
        }
    }

    postOrder(root) {
        if (root) {
            this.postOrder(root.left);
            this.postOrder(root.right);
            console.log(root.value);
        }
    }

    levelOrder() {
        const queue = [];
        queue.push(this.root);
        while (queue.length) {
            let curr = queue.shift();
            console.log(curr.value);
            if (curr.left) {
                queue.push(curr.left);
            }
            if (curr.right) {
                queue.push(curr.right);
            }
        }
    }

    height(node) {
        if (!node) {
            return 0;
        } else {
            const leftHeight = this.height(node.left);
            const rightHeight = this.height(node.right);
            return Math.max(leftHeight, rightHeight) + 1;
        }
    }

    printLevel(node, level) {
        if (!node) {
            return;
        }
        if (level === 1) {
            console.log(`${node.value} `);
        } else if (level > 1) {
            this.printLevel(node.left, level - 1);
            this.printLevel(node.right, level - 1);
        }
    }

    isBST(node = this.root, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
        if (!node) {
            return true;
        }
        if (node.value < min || node.value > max) {
            return false;
        }
        return (
            this.isBST(node.left, min, node.value) &&
            this.isBST(node.right, node.value, max)
        );
    }
}

const bst = new BinarySearchTree();
console.log("Is BST empty?", bst.isEmpty());
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(13);
bst.insert(17);
bst.insert(2);

console.log("\nIn-order traversal:");
bst.inOrder(bst.root);

console.log("\nPre-order traversal:");
bst.preOrder(bst.root);

console.log("\nPost-order traversal:");
bst.postOrder(bst.root);

console.log("\nLevel-order traversal (before deletion):");
bst.levelOrder();

console.log("\nTree height:", bst.height(bst.root));
console.log("Min value:", bst.min(bst.root));
console.log("Max value:", bst.max(bst.root));
console.log("Is valid BST?", bst.isBST());

console.log("\nDeleting 15...");
bst.delete(15);

console.log("\nLevel-order traversal (after deletion):");
bst.levelOrder();

console.log("\nIs still valid BST?", bst.isBST());