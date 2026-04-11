/**
 * TOPIC: Generics & Classes
 * Purpose: Understanding basic type safety in functions and classes.
 */

// 1. Basic Function Types
function addNumbers(a: number, b: number): number {
    return a + b;
}

console.log("Addition:", addNumbers(2, 3));

// 2. Generic Function: `pair`
// Takes two arguments of different types and returns them as a tuple [T, V].
function pair<T, V>(a: T, b: V): [T, V] {
    return [a, b];
}

const p = pair("hello", 42);
console.log("Pair:", p);

// 3. Generic Class: `Stack`
// A typesafe stack implementation.
class Stack<T> {
    private array: T[] = [];

    push(item: T): void {
        this.array.push(item);
    }

    pop(): T | undefined {
        return this.array.pop();
    }

    peek(): T | undefined {
        return this.array[this.array.length - 1];
    }
}

const s = new Stack<number>();
s.push(1);
s.push(2);
console.log("Stack Peek:", s.peek()); // 2
console.log("Stack Pop:", s.pop());  // 2
