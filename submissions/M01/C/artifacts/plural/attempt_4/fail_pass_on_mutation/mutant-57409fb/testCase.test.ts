import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns the word unchanged when num is 1", () => {
    expect(plural("cat", 1)).toBe("cat");
    expect(plural("box", 1)).toBe("box");
    expect(plural("person", 1)).toBe("person");
  });
});