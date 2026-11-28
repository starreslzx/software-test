import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns singular form when count is 1", () => {
    expect(plural("cat", 1)).toBe("cat");
  });
});