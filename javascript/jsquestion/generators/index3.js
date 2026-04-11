function* gen() {
    const a = yield 1;
    const b = yield a + 2;
    return b + 3;
}

const g = gen();

console.log(g.next());
console.log(g.next(5));
console.log(g.next(10));