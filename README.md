# iterable-chain

LINQ-style chaining methods for iterables with strict type-checking.


* Better Types

Methods have various overloads for better type inference.For example, `filter` has 3 overloads:

```typescript
interface Chain<T> {
  // normal
  filter(cb: Predicate<T>) : Chain<T>;
  // manual limit result to sub type
  filter<U extends T>(cb: Predicate<T>): Chain<U>;
  // explicit type protection to sub type
  filter<U extends T>(cb: TypeProtection<T, U>): Chain<U>;
}
```

* Fluent Interface

Use "chain"s to make your code more elegant.

```typescript
function uncapitalize<S extends string>(s: S): Uncapitalize<S> {
  // ...
}
const obj = { "gEt": 1, "PoSt": 2, "puT": 3 };

const uncapitalized = Object.fromEntries(
  Object.entries(obj)
    .map(p => [uncapitalize(p[0]), p[1]])
);

const elegant = obj
  .toPairs()
  .map(([key, value]) => [uncapitalize(key), value] as const)
  // key is "gEt" | "poSt" | "puT" now
  .toDictionary(p => p[0], p => p[1]);
```

## Install

`npm install @lovekicher/iterable-chain` or 

`yarn add @lovekicher/iterable-chain` or 

`pnpm install @lovekicher/iterable-chain`

## Quick Start

### Add Helper Methods(Optional)

```typescript
import "@lovekicher/iterable-chain/global";
```
This will add helper methods(and type definitions) to the prototype or constructor of some primitive types, such as `Array.prototype.chain`, `Array.range`, `Object.prototype.toPairs`, etc.

> Do this action only **ONCE** at the top of your code entry point

### Use Chain

1. Create chain

```typescript
import { chain } from "@lovekicher/iterable-chain";

const numbers = [1, 2, 3, 4, 5];

// From helper methods
const chain1 = numbers.chain();

// Or directly
const chain2 = chain(numbers);

```

2. Add chain operations and collectors

```typescript
const chain = [
    [2018, 99],
    [2019, 327],
    [2020, 404],
    [2021, 653],
    [2022, 202],
  ]
  .chain()
  .orderBy(x => x[1], true)
  .map(x => x[1])
  .filter(x => x % 2 == 0)
  .map(x => "0x" + x.toString(16));
// All callback functions have not been called

const result = chain.toArray();
// `toArray` is a collect method, now get ["0x194", "0xca"]
```

```typescript
const dict = [
    { owner: "foo", count: 3 },
    { owner: "bar", count: 10 },
    { owner: "baz", count: 16 },
  ]
  .chain()
  .toDictionary(x => x.owner, x => x.count);
/* {
  "foo": 3,
  "bar": 10,
  "baz": 16
} */
```
