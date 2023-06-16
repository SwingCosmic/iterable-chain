import { Mapper, AnyKey, Predicate, TypeProtection, KeyValuePair, Dictionary } from "../types";
import { ChainCollector } from "./collector";
import type { ChainOperation } from "./operation";



export interface Chain<T> extends ChainOperation<T>, ChainCollector<T> {
  /** @inheritdoc */
  valueOf(): T[];

  toJSON(): T[];
}
