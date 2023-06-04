import { Chain } from "./chain/Chain";
import { KeyValuePair, PrimitiveType } from "./types";
import type {} from "./global";
import { chain, range, repeat, toPairs } from "./chain";

declare global {
  interface Array<T> {
    chain(): Chain<T>; 
  }

  interface ArrayConstructor {
    range(start: number, end: number, step?: number): Chain<number>;
    repeat<V extends PrimitiveType>(value: V, count: number): Chain<V>;
    repeat<V>(factory: (() => V), count: number): Chain<V>;
  }

  interface Object {
    toPairs<T extends {}>(this: T): Chain<KeyValuePair<T>>;
  }
}

function applyToGlobal() {
  if (!Array.prototype.chain) {
    Array.prototype.chain = function () {
      return chain(this);
    };
    Array.range = range;
    Array.repeat = repeat;    
  }

  if (!Object.prototype.toPairs) {
    Object.prototype.toPairs = function () {
      return toPairs(this);
    };
  }
}

applyToGlobal();