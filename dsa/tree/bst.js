class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    isEmpty() {
        if (this.root == null) {
            return true;
        }
    }

    insert(value) {
        const newNode = new Node(value);
        if (this.isEmpty()) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode)
        }

    }

    insertNode(root, newNode) {
        if (root.value > newNode.value) {

            if (root.left === null) {
                root.left = newNode
            } else {
                this.insertNode(root.left, newNode)
            }

        } else {

            if (root.right === null) {
                root.right = newNode
            } else {
                this.insertNode(root.right, newNode)
            }
        }

    }

    search(root, value) {
        if (!root) {
            return false;
        } else {
            if (root.value < value) {
                return this.search(root.right, value)
            } else if (root.value === value) {
                return true
            } else {
                return this.search(root.left, value)
            }

        }
    }

    preOrder(root) {
        if (root) {
            console.log(root.value)
            this.preOrder(root.left)
            this.preOrder(root.right)

        }

    }

    inOrder(root) {
        if (root) {
            this.inOrder(root.left);
            console.log(root.value)
            this.inOrder(root.right)
        }

    }

    postOrder(root) {
        if (root) {
            this.postOrder(root.left);
            this.postOrder(root.right)
            console.log(root.value)
        }

    }

    levelOrder(root) {
        const queue = [];
        queue.push(root)
        while (queue.length) {
            let curr = queue.shift();
            console.log(curr.value);
            if (curr.left) {
                queue.push(curr.left)
            }
            if (curr.right) {
                queue.push(curr.right)
            }
        }
    }

    min(root){
        if(!root.left){
        return root.value
        }
        return this.min(root.left)
    }

    max(root) {
        if (!root.right) {
            return root.value
        }
        return this.max(root.right)
    }


    delete(value){

    }
}





const tree1 = new BST();


tree1.insert(10)
tree1.insert(5)
tree1.insert(15)
tree1.insert(3)
tree1.insert(7)

tree1.preOrder(tree1.root)
console.log("!!!!!!!!!!!!!!---------------!!!!!!!!!!!!!!!!!!!!!!")
tree1.inOrder(tree1.root)
console.log("!!!!!!!!!!!!!!---------------!!!!!!!!!!!!!!!!!!!!!!")
tree1.postOrder(tree1.root)
console.log("!!!!!!!!!!!!!!---------------!!!!!!!!!!!!!!!!!!!!!!")
tree1.levelOrder(tree1.root)

console.log("min",tree1.min(tree1.root))

console.log("max", tree1.max(tree1.root))

//console.log(tree1.search(tree1.root, 11));
