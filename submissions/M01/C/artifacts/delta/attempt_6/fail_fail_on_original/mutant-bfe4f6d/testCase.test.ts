import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta compose", () => {
  it("composes when the other delta starts with an embed retain whose data coerces to a number", () => {
    // Register an embed handler so compose can process embed retains.
    Delta.registerEmbed("image", {
      compose: (a: unknown, b: unknown) => b,
      invert: (a: unknown, b: unknown) => a,
      transform: (a: unknown, b: unknown) => b,
    });

    try {
      // this: insert "AB"
      const base = new Delta().insert("AB");
      // other: retain an embed whose data coerces to 1, followed by nothing else.
      // The embed data object has valueOf returning 1, so in the mutated code
      // the first-other block runs (since typeof retain !== 'number' but
      // attributes == null), and `peekLength() <= firstLeft` evaluates
      // numerically, consuming the leading insert.
      const embedData = { valueOf: () => 1 } as unknown as Record<string, unknown>;
      const other = new Delta().retain({ image: embedData });

      const result = base.compose(other);

      // Original: block is skipped because retain is not a number, so the
      // main loop handles the embed retain against the insert. The result
      // should be a single insert op (the embed retain applied to insert
      // yields an insert of the embed data).
      // Mutated: block runs, consumes the leading insert into `ops`, and
      // advances otherIter, changing the result.
      expect(result.ops).toEqual([{ insert: { image: embedData } }, { insert: "B" }]);
    } finally {
      Delta.unregisterEmbed("image");
    }
  });
});