import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns singular form for num equal to 1", () => {
    expect(plural("cat", 1)).toBe("cat");
  });
});