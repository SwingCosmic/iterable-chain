import { Mapper, AnyKey, Predicate, TypeProtection, KeyValuePair, Dictionary } from "../types";
import type { ChainOperation } from "./operation";



export interface Chain<T> extends ChainOperation<T> {
  valueOf(): T[];
  toJSON(): T[];


  toArray(): T[];

  toDictionary<K extends AnyKey>(keySelector: Mapper<T, K>): Record<K, T>;
  toDictionary<K extends AnyKey, U>(keySelector: Mapper<T, K>, valueSelector: Mapper<T, U>): Record<K, U>;

  toObject<O extends {}>(this: Chain<KeyValuePair<O>>): O;


  reduce(cb: (previousValue: T, currentValue: T) => T): T;
  reduce<U>(cb: (previousValue: U, currentValue: T) => U, initialValue: U): U;
  

  some(predicate: Predicate<T>): boolean;
  every(predicate: Predicate<T>): boolean;
  every<U extends T>(predicate: TypeProtection<T, U>): this is Chain<U>;

  groupBy<K extends AnyKey>(cb: Mapper<T, K>): Record<K, T[]>;
}
