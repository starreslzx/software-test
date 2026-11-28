import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta compose", () => {
  it("composes when the other delta starts with an embed retain whose data coerces to a number", () => {
    Delta.registerEmbed("image", {
      compose: (_a: unknown, b: unknown) => b,
      invert: (a: unknown, _b: unknown) => a,
      transform: (_a: unknown, b: unknown) => b,
    });

    try {
      const embedData = { valueOf: () => 1 };
      const base = new Delta().insert({ image: "a" });
      const other = new Delta().retain({ image: embedData });

      const result = base.compose(other);

      // Original: firstOther.retain is an object (not a number), so the
      // first-other optimization block is skipped. The main loop composes
      // the embed insert with the embed retain, producing an insert of the
      // composed embed data.
      //
      // Mutated: the block runs unconditionally (firstOther.attributes is
      // undefined). firstLeft = embedData, and `peekLength() <= firstLeft`
      // coerces embedData to 1, so the loop consumes the leading insert
      // into `ops` and advances otherIter past the retain, yielding the
      // original insert unchanged.
      expect(result.ops).toEqual([{ insert: { image: embedData } }]);
    } finally {
      Delta.unregisterEmbed("image");
    }
  });
});