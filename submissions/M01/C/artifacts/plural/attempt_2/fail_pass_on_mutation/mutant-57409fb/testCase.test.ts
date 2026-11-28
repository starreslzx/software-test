import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns the plural form when no count is provided", () => {
    expect(plural("cat")).toBe("cats");
    expect(plural("box")).toBe("boxes");
    expect(plural("person")).toBe("people");
  });
});