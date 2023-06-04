export type ChainMapper<T, U> = (value: T, index: number) => U;
export type ChainAction<T> = ChainMapper<T, void>;
export type ChainPredicate<T> = ChainMapper<T, boolean>;
export type ChainTypeProtection<T, U extends T> = (value: T, index: number) => value is U;


