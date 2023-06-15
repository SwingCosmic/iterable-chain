import { Mapper, AnyKey, Predicate, TypeProtection, KeyValuePair, Comparable } from "../types";
import { ascendingComparer, createKeyedArray, descendingComparer } from "../util";
import { Chain } from "./Chain";


export class ChainImpl<T> implements Chain<T> {

  private _iterator: IterableIterator<T>;
  constructor(array: Iterable<T>) {
    this._iterator = (function*() {
      for (const item of array) {
        yield item;
      }
    })();
  }


  valueOf(): T[] {
    return this.toArray();
  }
  toJSON(): T[] {
    return this.toArray();
  }



  toArray(): T[] {
    return Array.from(this._iterator);
  }

  toDictionary<K extends AnyKey>(keySelector: Mapper<T, K>): Record<K, T>;
  toDictionary<K extends AnyKey, U>(keySelector: Mapper<T, K>, valueSelector?: Mapper<T, U>): Record<K, U> {
    const ret: Record<any, any> = {};
    for (const item of this._iterator) {
      ret[keySelector(item)] = valueSelector?.(item) ?? item;
    }
    return ret as any;
  }

  toObject<O extends {}>(this: ChainImpl<KeyValuePair<O>>): O {
    return Object.fromEntries<O[keyof O]>(this._iterator) as O;
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
    for (const item of this._iterator) {
      const type = cb(item);
      if (!group[type]) {
        group[type] = [];
      }
      group[type].push(item);
    }
    return group;
  }


  //#region Operations
  filter<U extends T>(cb: TypeProtection<T, U>): Chain<U>;
  filter<U extends T>(cb: Predicate<T>): Chain<U>;
  filter(cb: Predicate<T>): Chain<T> {
    const iterator = this._iterator;
    this._iterator = (function* () {
      for (const e of iterator) {
        if (cb(e)) {
          yield e;
        }
      }
    })();
    return this;
  }

  map<U>(cb: Mapper<T, U>): Chain<U> {
    const iterator = this._iterator;
    this._iterator = (function* () {
      for (const e of iterator) {
        yield cb(e) as any;
      }
    })();
    return this as any;
  }

  orderBy<K extends Comparable>(keySelector: Mapper<T, K>, desc = false): Chain<T> {
    const iterator = this._iterator;
    this._iterator = (function* () {
      const keyedArray = createKeyedArray<T, K>(iterator, keySelector);
      const comparer = desc ? descendingComparer : ascendingComparer;
      keyedArray.sort(comparer);
      for (const e of keyedArray) {
        yield e.value;
      }
    })();
    return this;
  }

}
