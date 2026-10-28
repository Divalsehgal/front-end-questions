export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result: any = {};
  for (const key in obj) {
    if (!keys.includes(key as unknown as K)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function capitalize(str: string): string {
  const words = str.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i] !== '') {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1);
    }
  }
  return words.join(' ');
}

function reverseString(str: string): string {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

export function reverse<T extends string | number>(value: T): T {
  if (typeof value === 'string') {
    return reverseString(value) as T;
  }
  const num = value as number;
  const reversed = Number(reverseString(String(Math.abs(num)))); // -120 → "120" → "021" → 21
  return (num < 0 ? -reversed : reversed) as T;
}

export function mySplit(str: string, separator: string): string[] {
  const result: string[] = [];
  let current = '';
  let i = 0;
  while (i < str.length) {
    if (str.startsWith(separator, i)) {
      result.push(current);
      current = '';
      i += separator.length;
    } else {
      current += str[i];
      i++;
    }
  }
  result.push(current);
  return result;
}
