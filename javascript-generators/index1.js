
function* generator(i) {
    yield i;
    yield i * 2;
    yield i * 3;
}

const gen = generator(10);

console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);