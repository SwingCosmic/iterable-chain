
export type PrimitiveType = number | string | boolean | bigint;
export type Comparable = PrimitiveType | Date ;
export type Equatable = PrimitiveType | symbol;

export type AnyKey = keyof any;
export type AnyFunction = (...args: any[]) => any;
export type AnyConstructor = new(...args: any[]) => any;
export type Constructor<T> = new(...args: any[]) => T & object;

export type MethodName<T> = {
    [P in keyof T]: T[P] extends AnyFunction ? P : never;
}[keyof T];
export type KeyName<T> = Exclude<keyof T, MethodName<T>>;
export type PropertyName<T> = KeyName<T> & string;

export type Dictionary<T> = Record<string, T>;
export type KeyValuePair<T extends {}> = [key: keyof T, value: T[keyof T]];

export type Mapper<T, U> = (obj: T) => U;
export type Action<T> = Mapper<T, void>;
export type MemberMapper<T, K extends keyof T>  = Mapper<T, K>;
export type PropertyMapper<T, K extends PropertyName<T>> = MemberMapper<T, K>;
export type NumberMapper<T> = Mapper<T, number>;
export type Predicate<T> = Mapper<T, boolean>;
export type TypeProtection<T, U extends T> = (obj: T) => obj is U;

type ThisTypeMethod<F extends AnyFunction, TThis> = F extends (...args: infer P) => infer R 
  ? (this: TThis, ...args: P) => R
  : never;
  
export type OrderString = "asc" | "desc";