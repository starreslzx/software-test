import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta transform", () => {
  it("transforms a retain with a null otherData as a numeric retain", () => {
    // this retains an embed-like object, other retains null
    const a = new Delta().retain({ image: "x" });
    const b = new Delta().retain(null as any);

    const result = a.transform(b, false);

    // With original code, otherData === null so transformedData is the numeric length (1),
    // not null. With the mutation, transformedData becomes null.
    expect(result.ops).toEqual([{ retain: 1 }]);
  });
});