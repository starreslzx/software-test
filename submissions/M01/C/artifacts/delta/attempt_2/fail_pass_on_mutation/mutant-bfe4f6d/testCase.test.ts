import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta compose", () => {
  it("composes correctly when the other delta starts with a delete op followed by a retain", () => {
    // this: insert "A"
    const base = new Delta().insert("A");
    // other: delete 1, then retain 1
    const other = new Delta().delete(1).retain(1);

    const result = base.compose(other);

    // Original behavior: firstOther is a delete op, so the first-other
    // optimization block is skipped. Main loop: thisIter insert "A" +
    // otherIter delete 1 -> insert + delete cancels out; then otherIter
    // retain 1 -> nothing left in thisIter, so nothing pushed. Result empty.
    // Mutated behavior: the block runs unconditionally, firstLeft =
    // firstOther.retain = undefined. The while loop condition
    // thisIter.peekLength() <= undefined is false, so loop doesn't run.
    // Then firstOther.retain - firstLeft = undefined - undefined = NaN,
    // NaN > 0 is false, so otherIter.next is not called. Main loop then
    // processes as before... but the behavior may differ for the retain.
    expect(result.ops).toEqual([]);
  });
});