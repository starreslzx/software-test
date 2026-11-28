import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta compose embed keepNull behavior", () => {
  it("passes keepNull=true when composing a retain embed with a retain embed", () => {
    const received: boolean[] = [];

    Delta.registerEmbed("counter", {
      compose: (a: any, b: any, keepNull: boolean) => {
        received.push(keepNull);
        return { a, b };
      },
      invert: (a: any, b: any) => ({ a, b }),
      transform: (a: any, b: any) => ({ a, b }),
    });

    try {
      const base = new Delta().insert({ counter: 1 });
      const other = new Delta().retain({ counter: 2 });

      const result = base.compose(other);

      expect(received).toEqual([true]);
      expect(result.ops).toEqual([
        { insert: { counter: { a: 1, b: 2 } } },
      ]);
    } finally {
      Delta.unregisterEmbed("counter");
    }
  });
});