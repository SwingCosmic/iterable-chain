import {test, expect, jest, describe,beforeAll }from "@jest/globals";
import "@lovekicher/iterable-chain/global";

expect(Array.range).toBeDefined()

describe("测试操作方法", () => {

  test("orderBy", () => {
    const data = [
      { name: "1", value: 3.7 },
      { name: "2", value: 1 },
      { name: "3", value: 114514 },
      { name: "4", value: -99 },
      { name: "5", value: 0 },
      { name: "6", value: 114514 },
    ];

    const result = data
      .chain()
      .orderBy(d => d.value, true)
      .toArray();

    expect(result).toEqual([
      // 稳定排序
      { name: "3", value: 114514 },
      { name: "6", value: 114514 },
      { name: "1", value: 3.7 },
      { name: "2", value: 1 },
      { name: "5", value: 0 },
      { name: "4", value: -99 },
    ]);
    expect(result[2]).toBe(data[0]);
  })


})
