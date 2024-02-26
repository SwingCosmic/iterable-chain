import { Mapper, AnyKey, Predicate, TypeProtection, KeyValuePair, Comparable, NumberMapper } from "../types";
import { ascendingComparer, createKeyedArray, descendingComparer } from "../util";
import { Chain } from "./Chain";


export class ChainImpl<T> implements Chain<T> {

  private _iterator: () => Generator<T>;
  constructor(array: Iterable<T>) {
    this._iterator = function*() {
      for (const item of array) {
        yield item;
      }
    };
  }


  valueOf(): T[] {
    return this.toArray();
  }
  toJSON(): T[] {
    return this.toArray();
  }



  //#region Collectors
  toArray(): T[] {
    return Array.from(this._iterator());
  }

  toDictionary<K extends AnyKey>(keySelector: Mapper<T, K>): Record<K, T>;
  toDictionary<K extends AnyKey, U>(keySelector: Mapper<T, K>, valueSelector?: Mapper<T, U>): Record<K, U> {
    const ret: Record<any, any> = {};
    for (const item of this._iterator()) {
      ret[keySelector(item)] = valueSelector?.(item) ?? item;
    }
    return ret as any;
  }

  toMap<K extends AnyKey>(keySelector: Mapper<T, K>): Map<K, T>;
  toMap<K extends AnyKey, U>(keySelector: Mapper<T, K>, valueSelector?: Mapper<T, U>): Map<K, U> {
    const ret = new Map<K, any>();
    for (const item of this._iterator()) {
      ret.set(keySelector(item), valueSelector?.(item) ?? item);
    }
    return ret;
  }

  toObject<O extends {}>(this: ChainImpl<KeyValuePair<O>>): O {
    return Object.fromEntries<O[keyof O]>(this._iterator()) as O;
  }

  reduce(cb: (previousValue: T, currentValue: T) => T): T;
  reduce<U>(cb: (previousValue: U, currentValue: T) => U, initialValue?: U): U {
    return this.toArray().reduce<U>(cb, initialValue!);
  }

  some(predicate: Predicate<T>): boolean {
    return this.toArray().some(predicate);
  }

  every<U extends T>(predicate: TypeProtection<T, U>): this is Chain<U>;
  every(predicate: Predicate<T>): boolean {
    return this.toArray().every(predicate);
  }

  groupBy<K extends AnyKey>(cb: Mapper<T, K>): Record<K, T[]> {
    let group: Record<K, T[]> = {} as any;
    for (const item of this._iterator()) {
      const type = cb(item);
      if (!group[type]) {
        group[type] = [];
      }
      group[type].push(item);
    }
    return group;
  }

  sum(this: Chain<number>): number;
  sum(selector?: NumberMapper<any>): number {
    let result = 0;
    let array = this.toArray();
    // 循环比reduce更快
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      result += selector ? selector(item) : (item as number);
    }
    return result;
  }

  average(this: Chain<number>): number;
  average(selector?: NumberMapper<any>): number {
    let result = 0;
    let array = this.toArray();
    // 循环比reduce更快
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      result += selector ? selector(item) : (item as number);
    }
    return array.length > 0 ? result / array.length : 0;
  }

  join(separator?: string | undefined): string {
    return this.toArray().join(separator);
  }
  //#endregion


  //#region Operations
  filter<U extends T>(cb: TypeProtection<T, U>): Chain<U>;
  filter<U extends T>(cb: Predicate<T>): Chain<U>;
  filter(cb: Predicate<T>): Chain<T> {
    const iterator = this._iterator;
    this._iterator = function* () {
      for (const e of iterator()) {
        if (cb(e)) {
          yield e;
        }
      }
    };
    return this;
  }

  map<U>(cb: Mapper<T, U>): Chain<U> {
    const iterator = this._iterator;
    this._iterator = function* () {
      for (const e of iterator()) {
        yield cb(e) as any;
      }
    };
    return this as any;
  }

  orderBy<K extends Comparable>(keySelector: Mapper<T, K>, desc = false): Chain<T> {
    const iterator = this._iterator;
    this._iterator = function* () {
      const keyedArray = createKeyedArray<T, K>(iterator(), keySelector);
      const comparer = desc ? descendingComparer : ascendingComparer;
      keyedArray.sort(comparer);
      for (const e of keyedArray) {
        yield e.value;
      }
    };
    return this;
  }

  reverse(): Chain<T> {
    const iterator = this._iterator;
    this._iterator = function* () {
      const array = Array.from(iterator()).reverse();
      for (let i = 0; i < array.length; i++) {
        yield array[i];
      }
    };
    return this;
  }

  //#endregion

}
