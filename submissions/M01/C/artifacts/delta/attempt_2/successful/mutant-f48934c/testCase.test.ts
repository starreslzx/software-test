import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta insert", () => {
  it("should not treat an embed object with a length property as an empty string", () => {
    const delta = new Delta();
    const embed = { length: 0 };

    delta.insert(embed);

    expect(delta.ops).toEqual([{ insert: embed }]);
  });
});