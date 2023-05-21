import { Chain } from "./chain";
import { PrimitiveType } from "./types";

declare global {
  interface Array<T> {
    chain(): Chain<T>; 
  }

  interface ArrayConstructor {
    range(start: number, end: number, step?: number): Chain<number>;
    repeat<V extends PrimitiveType>(value: V, count: number): Chain<V>;
    repeat<V>(factory: (() => V), count: number): Chain<V>;
  }
}