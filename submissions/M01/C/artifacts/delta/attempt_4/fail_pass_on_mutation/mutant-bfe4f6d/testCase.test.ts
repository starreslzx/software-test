import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta compose", () => {
  it("composes correctly when the other delta starts with a delete op followed by an insert", () => {
    // this: insert "AB"
    const base = new Delta().insert("AB");
    // other: delete 1, then insert "X"
    const other = new Delta().delete(1).insert("X");

    const result = base.compose(other);

    expect(result.ops).toEqual([{ insert: "XB" }]);
  });
});