import { TypeProtection, Predicate, Mapper, AnyKey, KeyValuePair } from "../types";
import type { Chain } from "./Chain";
import { ChainImpl } from "./ChainImpl";


export function chain<T>(item: Iterable<T>): Chain<T> {
  return new ChainImpl<T>(item);
}

export function repeat<T>(value: T | (() => T), count: number): Chain<T> {
  const repeat = function*()  {
    if (typeof value === "function") {
      for (let i = 1; i <= count; i++) {
        yield((value as any)());
      }
    } else {
      for (let i = 1; i <= count; i++) {
        yield(value);
      }
    }
  };

  return new ChainImpl<T>(repeat());
}

export function range(start: number, end: number, step = 1): Chain<number> {
  if (step == 0) {
    throw new TypeError("step cannot be 0");
  }
  if (step > 0 && start > end) {
    throw new TypeError("end cannot be smaller than start when step > 0");
  }
  if (step < 0 && start < end) {
    throw new TypeError("end cannot be bigger than start when step < 0");
  }

  const range = function*()  {
    if (step > 0) {
      for (let i = start; i <= end; i += step) {
        yield(i);
      }      
    } else {
      for (let i = start; i >= end; i += step) {
        yield(i);
      }  
    }

  };

  return new ChainImpl<number>(range());
}



export function toPairs<T extends {}>(obj: T): Chain<KeyValuePair<T>> {
  const toPairs = function*() {
    for (const p of Object.entries(obj)) {
      yield p as KeyValuePair<T>;
    }
    // Object.entries不返回可枚举的symbol
    for (const s of Object.getOwnPropertySymbols(obj)) {
      const desc = Object.getOwnPropertyDescriptor(obj, s)!;
      if (desc.enumerable) {
        yield [s, (obj as any)[s]] as KeyValuePair<T>;
      }
    }
  }
  return new ChainImpl(toPairs());
}

export type { Chain } from "./Chain";