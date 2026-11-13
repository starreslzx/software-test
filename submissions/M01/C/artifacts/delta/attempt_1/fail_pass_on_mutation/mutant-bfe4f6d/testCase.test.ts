import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta compose", () => {
  it("composes correctly when the other delta starts with a delete op", () => {
    // this: insert "A"
    const base = new Delta().insert("A");
    // other: delete 1, then insert "B"
    const other = new Delta().delete(1).insert("B");

    const result = base.compose(other);

    // Original behavior: firstOther is a delete op (retain is undefined),
    // so the first-other optimization block is skipped. The main loop
    // processes: otherIter insert "B" -> push insert "B"; then thisIter
    // insert "A" + otherIter delete 1 -> insert + delete cancels out.
    // Result should be just insert "B".
    expect(result.ops).toEqual([{ insert: "B" }]);
  });
});