import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns singular when count is 1, plural when undefined", () => {
    expect(plural("cat", 1)).toBe("cat");
    expect(plural("cat", undefined)).toBe("cats");
  });
});