/**
 * @template TResult
 * @param {(...args: Array<unknown>) => void} func
 * @returns {(...args: Array<unknown>) => Promise<TResult>}
 */
export default function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const callback = (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };

      func.call(this, ...args, callback);
    });
  };
}

function multiplyCallback(a, b, callback) {
  setTimeout(() => {
    if (typeof a !== "number" || typeof b !== "number") {
      callback(new TypeError("Arguments must be numbers"));
      return;
    }
    const res = a * b;
    callback(null, res);
  }, 500);
}

const multiplyPromise = promisify(multiplyCallback);

async function run() {
  try {
    const result = await multiplyPromise(5, 3);
    console.log("Success:", result); 

    await multiplyPromise("5", 3);
  } catch (err) {
    console.error("Caught error:", err.message);
  }
}

run();
