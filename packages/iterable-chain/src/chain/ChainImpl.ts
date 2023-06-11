import { Mapper, AnyKey, Predicate, TypeProtection, KeyValuePair, Comparable } from "../types";
import { ascendingComparer, createKeyedArray, descendingComparer } from "../util";
import { Chain, OperationFn } from "./Chain";


export class ChainImpl<T> implements Chain<T> {

  private readonly _items: Iterable<T>;
  private _operations: OperationFn[] = [];
  constructor(array: Iterable<T>) {
    this._items = array;
  }


  valueOf(): T[] {
    return this.toArray();
  }
  toJSON(): T[] {
    return this.toArray();
  }


  private createIterable(): Iterable<T> {
    let value: Iterable<any> = this._items;
    for (const f of this._operations) {
      value = f(value);
    }
    return value;
  }

  toArray(): T[] {
    return Array.from(this.createIterable());
  }

  toDictionary<K extends AnyKey>(keySelector: Mapper<T, K>): Record<K, T>;
  toDictionary<K extends AnyKey, U>(keySelector: Mapper<T, K>, valueSelector?: Mapper<T, U>): Record<K, U> {
    const ret: Record<any, any> = {};
    for (const item of this.createIterable()) {
      ret[keySelector(item)] = valueSelector?.(item) ?? item;
    }
    return ret as any;
  }

  toObject<O extends {}>(this: ChainImpl<KeyValuePair<O>>): O {
    return Object.fromEntries<O[keyof O]>(this.createIterable()) as O;
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
    for (const item of this.createIterable()) {
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
    this._operations.push(function* (items: Iterable<T>) {
      for (const e of items) {
        if (cb(e)) {
          yield e;
        }
      }
    });
    return this;
  }

  map<U>(cb: Mapper<T, U>): Chain<U> {
    this._operations.push(function* (items: Iterable<T>) {
      for (const e of items) {
        yield cb(e);
      }
    });
    return this as any;
  }

  orderBy<K extends Comparable>(keySelector: Mapper<T, K>, desc = false): Chain<T> {
    this._operations.push(function* (items: Iterable<T>) {
      const keyedArray = createKeyedArray<T, K>(items, keySelector);
      const comparer = desc ? descendingComparer : ascendingComparer;
      keyedArray.sort(comparer);
      for (const e of keyedArray) {
        yield e.value;
      }
    });
    return this;
  }

}
