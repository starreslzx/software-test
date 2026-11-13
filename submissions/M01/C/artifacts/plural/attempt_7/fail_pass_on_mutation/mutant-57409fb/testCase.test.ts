import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns singular for count of 1 and plural otherwise", () => {
    expect(plural("cat", 1)).toBe("cat");
    expect(plural("cat", 2)).toBe("cats");
  });
});