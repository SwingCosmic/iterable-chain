import { repeat } from "../chain";

export function times(str: string, count: number) {
  return repeat(str, count).join("");
}