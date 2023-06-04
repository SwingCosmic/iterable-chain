import {test, expect, jest, describe,beforeAll }from "@jest/globals";
import "iterable-chain/global";
import {Chain, chain} from "iterable-chain";

expect(Array.range).toBeDefined()


describe("基础使用", () => {

  const data = [1,2,3,4,5,6];
  const steps: any[] = [];

  const f1 = jest.fn((v: number) => {
    steps.push(1)
    return v % 2 == 0
  });
  const f2 = jest.fn((v: number) => {
    steps.push(2)
    return v + ""
  });
  
  let t = data.chain()
    .filter(f1)
    .map(f2);

  test("在调用终结方法前没有调用回调", () => {
    expect(f1).toHaveBeenCalledTimes(0);
    expect(f2).toHaveBeenCalledTimes(0);

  })


  test("调用终结方法后能按顺序正确输出", () => {
    const r2 = t.toArray();

    expect(r2).toEqual(["2", "4", "6"]);

    expect(f1).toHaveBeenCalledTimes(6);
    expect(f2).toHaveBeenCalledTimes(3);

    expect(steps).toEqual([1,1,2,1,1,2,1,1,2]);

  }) 


})

describe("测试起始方法", () => {

  test("chain对于一般可迭代类型", () => {
    const map = new Map<string, number>();
    map.set("a", 1);
    map.set("b", 2);
    map.set("c", 3);
    const r = chain(map)
      .map(p => p[1])
      .toArray();

    expect(r).toEqual([1,2,3]);
  })

  describe("range", () => {
    test("step > 0 and step != 1", () => {
      const r = Array.range(1, 10, 2).toArray();
      expect(r).toEqual([1,3,5,7,9]);
    })

    test("step < 0", () => {
      const r = Array.range(2, 0.114514, -0.5).toArray();
      expect(r).toEqual([2, 1.5, 1, 0.5]);
    })
  })

})