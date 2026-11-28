import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("pluralizes when num is undefined", () => {
    expect(plural("cat", undefined)).toBe("cats");
    expect(plural("box", undefined)).toBe("boxes");
  });
});