import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("returns the singular word unchanged when num is undefined", () => {
    expect(plural("cat")).toBe("cat");
    expect(plural("box")).toBe("box");
    expect(plural("person")).toBe("person");
  });
});