import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta insert", () => {
  it("should insert non-string objects (embeds) rather than treating them as empty strings", () => {
    const delta = new Delta();
    const embed = { image: "https://example.com/pic.png" };

    delta.insert(embed);

    expect(delta.ops).toEqual([{ insert: embed }]);
  });
});