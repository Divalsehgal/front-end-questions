/*
In we represent Binary Tree in a array in a level order then there should not be any gaps in array
A heap must be a complete binary tree (every level filled left-to-right, gaps only at the end of the last level)
min vs max is just value-ordering, unrelated to shape; a "full" binary tree (every node has 0 or 2 children) is a different, unrelated shape property
height is logn
*/


class PriorityQueues {
    constructor(type) {
        this.type = type;
        this.heap = [];
    }

    compare(a, b) {
        return this.type === 'min' ? a < b : a > b
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
    }

    getPeek() {
        return this.heap[0]
    }

    getParent(i) {
        return Math.floor((i - 1) / 2)
    }

    getLeft(i) {
        return 2 * i + 1
    }

    getRight(i) {
        return 2 * i + 2
    }

    push(val) {
        this.heap.push(val)
        this.bubbleUp()
    }

    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop()
        const top = this.heap[0]
        this.heap[0] = this.heap.pop()
        this.bubbleDown()
        return top
    }
    size() {
        return this.heap.length;
    }

    bubbleUp() {
        let i = this.heap.length - 1;
        while (i > 0 && this.compare(this.heap[i], this.heap[this.getParent(i)])) {
            this.swap(i, this.getParent(i))
            i = this.getParent(i)
        }
    }

    bubbleDown() {
        let i = 0;
        let n = this.heap.length
        while (this.getLeft(i) < n) {
            let bestChild = this.getLeft(i);
            if (this.getRight(i) < n && this.compare(this.heap[this.getRight(i)], this.heap[bestChild])) {
                bestChild = this.getRight(i);
            }

            if (this.compare(this.heap[i], this.heap[bestChild]) || this.heap[i] === this.heap[bestChild]) {
                break;
            }
            this.swap(i, bestChild)
            i = bestChild
        }
    }
}
