import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta compose", () => {
  it("composes correctly when the other delta starts with a delete op followed by an insert", () => {
    // this: insert "AB"
    const base = new Delta().insert("AB");
    // other: delete 1, then insert "X"
    const other = new Delta().delete(1).insert("X");

    const result = base.compose(other);

    // Original: firstOther is a delete op, so the first-other block is
    // skipped. Main loop: otherIter insert "X" -> push insert "X"; then
    // thisIter insert "AB" (length 2) with otherIter delete 1 -> insert
    // + delete cancels out (length 1); then thisIter insert "B" remains
    // with no other -> nothing. Result: insert "X".
    //
    // Mutated: the block runs unconditionally. firstLeft = undefined.
    // The while loop: thisIter.peekLength() (2) <= undefined is false,
    // so loop doesn't run. firstOther.retain - firstLeft = NaN, NaN > 0
    // is false. So otherIter.next is not called. Main loop then runs
    // the same way... but the behavior may differ because the first
    // other op (delete) is consumed differently.
    expect(result.ops).toEqual([{ insert: "X" }]);
  });
});