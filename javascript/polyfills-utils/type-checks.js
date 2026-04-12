/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isArray(value) {
  return Array.isArray(value) ? true : false;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isFunction(value) {
  return typeof value === "function" ? true : false;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isObject(value) {
  if (value == null) {
    return false;
  }
  return typeof value === "object" || typeof value === "function"
    ? true
    : false;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPlainObject(value) {
  if (value == null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
