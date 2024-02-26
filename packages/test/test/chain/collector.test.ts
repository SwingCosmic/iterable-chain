import {test, expect, jest, describe,beforeAll }from "@jest/globals";
import "@lovekicher/iterable-chain/global";

expect(Array.range).toBeDefined()

describe("测试终结方法", () => {
  
  test("groupBy", () => {

    interface TestItem {
      type: "a" | "b",
      name: string;
    }
    const list: TestItem[] = [
      {
        type: "a",
        name: "type a 1"
      },
      {
        type: "a",
        name: "type a 2"
      },
      {
        type: "b",
        name: "type b"
      },
    ];

    const group = list
      .chain()
      .groupBy(i => i.type);
    
    expect(Object.keys(group)).toEqual(["a", "b"]);
    expect(group.a).toHaveLength(2);
    expect(group.b).toHaveLength(1);

    
  })

  test("sum", () => {
    const sum1 = [1,2,3,4]
      .chain()
      .sum();
    expect(sum1).toEqual(10);

    const sum2 = [
        { name: "foo", value: -1.5 },
        { name: "bar", value: 3},
        { name: "baz", value: 4.5 },
      ]
      .chain()
      .sum(x => x.value);
    expect(sum2).toEqual(6);

    expect([].chain().sum()).toEqual(0);
  })

  test("average", () => {
    const sum1 = [1,2,3,4]
      .chain()
      .average();
    expect(sum1).toEqual(2.5);

    const sum2 = [
        { name: "foo", value: -1.5 },
        { name: "bar", value: 3},
        { name: "baz", value: 4.5 },
      ]
      .chain()
      .average(x => x.value);
    expect(sum2).toEqual(2);

    expect([].chain().average()).toEqual(0);
  })
})

describe("测试重复调用", () => {

  test("多次sum应该和原来一样", () => {
    const data = [1,2,3,4,5,6];

    const c = data.chain();

    expect(c.sum()).toEqual(21);
    expect(c.sum()).toEqual(21);
    expect(c.sum()).toEqual(21);
  })

})