import type { Chain } from "./Chain";
import { AnyFunction, Comparable, KeyValuePair, Mapper, Predicate, TypeProtection } from "../types";

export interface ChainOperation<T> {
  filter(cb: Predicate<T>) : Chain<T>;
  filter<U extends T>(cb: TypeProtection<T, U>): Chain<U>;
  filter<U extends T>(cb: Predicate<T>): Chain<U>;

  map<U>(cb: Mapper<T, U>): Chain<U>;

  orderBy<K extends Comparable>(keySelector: Mapper<T, K>, desc?: boolean): Chain<T>;

  reverse(): Chain<T>;
}
