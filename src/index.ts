import type {} from "./global";

export * from "./types";

import { chain, Chain, _from, range, repeat } from "./chain";


export function applyToGlobal() {
  Array.prototype.chain = _from;
  Array.range = range;
  Array.repeat = repeat;
}

export { Chain, chain, range, repeat };