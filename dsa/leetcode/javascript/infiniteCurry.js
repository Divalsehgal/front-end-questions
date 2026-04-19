function curry(fn) {
  const f1 = fn.length;
  return function innerCurry(...args1) {
    const f2 = args1.length;
    const context=this
    if (f1 <= f2) {
      return fn.apply(context, args1);
    } else {
      return function (...args2) {
        return innerCurry.apply(context, args1.concat(args2));
      };
    }
  };
}

const join = (a, b, c) => {
  return `${a}_${b}_${c}`;
};

const curriedJoin = curry(join);

console.log(curriedJoin(1, 2, 3)); // '1_2_3'

console.log(curriedJoin(1)(2, 3)); // '1_2_3'

console.log(curriedJoin(1, 2)(3)); // '1_2_3'

console.log(curriedJoin(1) (2)(3)); // '1_2_3'
