import {test, expect, jest, describe,beforeAll }from "@jest/globals";
import "@lovekicher/iterable-chain/global";
import {Chain, chain} from "@lovekicher/iterable-chain";

expect(Object.prototype.toPairs).toBeDefined()


describe("对象测试", () => {

  const obj = {
    1: 1,
    "b": 2,
  };
  const rebuildObj = obj
    .toPairs()
    .toObject();

  test("toPairs和toObject应该可逆", () => {
    expect(obj).toEqual(rebuildObj);
  });


  const obj2 = {
    1: 1,
    [Symbol.toStringTag]: "obj2",
    "c": 3
  };
  const rebuildObj2 = obj2
    .toPairs()
    .toObject();

  test("toPairs支持symbol", () => {
    expect(obj2).toEqual(rebuildObj2);
  });


})
