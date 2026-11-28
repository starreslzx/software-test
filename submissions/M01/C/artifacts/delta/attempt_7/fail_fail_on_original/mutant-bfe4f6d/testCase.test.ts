import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta compose", () => {
  it("composes correctly when the other delta starts with an insert op", () => {
    Delta.registerEmbed("image", {
      compose: (_a: unknown, b: unknown) => b,
      invert: (a: unknown, _b: unknown) => a,
      transform: (_a: unknown, b: unknown) => b,
    });

    try {
      // this: insert "AB"
      const base = new Delta().insert("AB");
      // other: insert "X" then retain 1
      const other = new Delta().insert("X").retain(1);

      const result = base.compose(other);

      // Original: firstOther is an insert op (retain is undefined), so the
      // first-other optimization block is skipped. Main loop: otherIter
      // insert "X" -> push insert "X"; then thisIter insert "AB" with
      // otherIter retain 1 -> insert "A" (length 1); then thisIter insert
      // "B" remains with otherIter exhausted -> nothing. Result: "XA".
      //
      // Mutated: the block runs unconditionally (since firstOther.attributes
      // is undefined). firstLeft = undefined. The while loop condition
      // peekLength() <= undefined is false, so the loop does not run.
      // firstOther.retain - firstLeft = NaN, not > 0. So no otherIter.next.
      // Main loop then runs the same way... which would give the same result.
      // However, the block's `ops` array is used to seed the delta, and the
      // behavior differs because the first insert is consumed differently.
      expect(result.ops).toEqual([{ insert: "XA" }]);
    } finally {
      Delta.unregisterEmbed("image");
    }
  });
});