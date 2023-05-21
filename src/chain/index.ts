import { TypeProtection, Predicate, Mapper } from "../types";
import type { ChainOperation } from "./operation";
import { ChainPredicate, ChainTypeProtection, ChainMapper } from "./types";


export interface Chain<T> extends ChainOperation<T>{
  valueOf(): T[];
  toJSON(): T[];


  toArray(): T[];
}


interface OperationFn {
  (items: Iterable<any>): Generator<any, void, unknown>;
}

class ChainImpl<T> implements Chain<T> {

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




  toArray(): T[] {
    let value: Iterable<any> = this._items;
    for (const f of this._operations) {
      value = f(value)
    }
    return Array.from(value);
  }



  //#region Operations

  filter<U extends T>(cb: TypeProtection<T, U>): Chain<U>;
  filter<U extends T>(cb: Predicate<T>): Chain<U>;
  filter(cb: Predicate<T>): Chain<T> {
    this._operations.push(function*(items: Iterable<T>) {
      for (const e of items) {
        if(cb(e)) {
          yield e;
        }
      }
    });
    return this;
  }

  map<U>(cb: Mapper<T, U>): Chain<U> {
    this._operations.push(function*(items: Iterable<T>) {
      for (const e of items) {
        yield cb(e);
      }
    });
    return this as any;
  }

  //#endregion


}


export function chain<T>(item: Iterable<T>): Chain<T> {
  return new ChainImpl<T>(item);
}

export function _from<T>(this: Array<T>): Chain<T> {
  return new ChainImpl<T>(this);
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