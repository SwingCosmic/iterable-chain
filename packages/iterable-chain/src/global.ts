import { Chain } from "./chain/Chain";
import { PrimitiveType } from "./types";
import type {} from "./global";
import { chain, range, repeat } from "./chain";

declare global {
  interface Array<T> {
    chain(): Chain<T>; 
  }

  interface ArrayConstructor {
    range(start: number, end: number, step?: number): Chain<number>;
    repeat<V extends PrimitiveType>(value: V, count: number): Chain<V>;
    repeat<V>(factory: (() => V), count: number): Chain<V>;
  }

  interface ObjectConstructor {
    
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
}

applyToGlobal();