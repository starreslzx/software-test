import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta compose", () => {
  it("composes correctly when the other delta starts with a delete op", () => {
    // this: insert "AB"
    const base = new Delta().insert("AB");
    // other: delete 1, then retain 1
    const other = new Delta().delete(1).retain(1);

    const result = base.compose(other);

    // Original: firstOther is a delete op (retain is undefined), so the
    // first-other optimization block is skipped. Main loop: thisIter insert
    // "AB" with otherIter delete 1 -> insert + delete cancels out (length 1);
    // then thisIter insert "B" with otherIter retain 1 -> insert "B".
    // Result: insert "B".
    //
    // Mutated: the block runs unconditionally (firstOther.attributes is
    // undefined). firstLeft = undefined. The while loop condition
    // peekLength() <= undefined is false, so the loop does not run.
    // firstOther.retain - firstLeft = NaN, not > 0. So no otherIter.next.
    // Main loop then runs the same way... which would give the same result.
    expect(result.ops).toEqual([{ insert: "B" }]);
  });
});