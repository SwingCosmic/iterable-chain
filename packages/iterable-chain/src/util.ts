import { Mapper } from "./types";

/**
 * 根据Same Value Zero规则比较相等性，即NaN == NaN且-0 == +0
 * @author MDN
 */
export function sameValueZero(x: unknown, y: unknown) {
  if (typeof x === "number" && typeof y === "number") {
    // x 和 y 相等（可能是 -0 和 0）或它们都是 NaN
    return x === y || (x !== x && y !== y);
  }
  return x === y;
}


export interface Keyed<T, K> {
  key: K,
  value: T
}

export function createKeyedArray<T, K>(items: Iterable<T>, keySelector: Mapper<T, K>):  Keyed<T, K>[] {
  let array: T[] = items as any;
  if (!Array.isArray(items)) {
    array = Array.from(items);
  }
  return array.map(v => ({
    value: v,
    key: keySelector(v)
  }));
}

export const ascendingComparer = function<T, K>(a: Keyed<T, K>, b: Keyed<T, K>) {
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

export const descendingComparer = function<T, K>(a: Keyed<T, K>, b: Keyed<T, K>) {
  return a.key > b.key ? -1 : a.key < b.key ? 1 : 0;
}