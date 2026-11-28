import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns singular form when count is exactly 1", () => {
    expect(plural("person", 1)).toBe("person");
    expect(plural("box", 1)).toBe("box");
    expect(plural("cat", 1)).toBe("cat");
  });
});