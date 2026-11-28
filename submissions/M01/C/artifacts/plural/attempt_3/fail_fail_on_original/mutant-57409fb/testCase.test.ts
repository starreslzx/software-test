import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns the singular form when num is explicitly undefined", () => {
    expect(plural("cat", undefined)).toBe("cat");
    expect(plural("box", undefined)).toBe("box");
    expect(plural("person", undefined)).toBe("person");
  });
});