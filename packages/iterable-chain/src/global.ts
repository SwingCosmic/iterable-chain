import { Chain } from "./chain/Chain";
import { AnyKey, Constructor, KeyValuePair, PrimitiveType } from "./types";
import type {} from "./global";
import { chain, range, repeat, toPairs } from "./chain";
import { remove } from "./extension/array";
import { times } from "./extension/string";
import { extendPrototype } from "./util";

declare global {
  interface Array<T> {
    chain(): Chain<T>; 
    remove(item: T): void;
  }

  interface ArrayConstructor {
    range(start: number, end: number, step?: number): Chain<number>;
    repeat<V extends PrimitiveType>(value: V, count: number): Chain<V>;
    repeat<V>(factory: (() => V), count: number): Chain<V>;
  }

  interface Object {
    toPairs<T extends {}>(this: T): Chain<KeyValuePair<T>>;
  }

  interface String {
    times(count: number): string;
  }
}


function applyToGlobal() {
  if (!Array.prototype.chain) {
    extendPrototype(Array, "chain", function () {
      return chain(this);
    });
    
    extendPrototype(Array, "remove",function (item) {
      return remove(this, item);
    });

    Array.range = range;
    Array.repeat = repeat;   
  }

  if (!Object.prototype.toPairs) {
    extendPrototype(Object, "toPairs", function () {
      return toPairs(this);
    });
  }

  if (!String.prototype.times) {
    extendPrototype(String, "times", function (count) {
      return times(this as string, count);
    });
  }
}

applyToGlobal();