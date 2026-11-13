import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("should pluralize 'dwarf' and 'roof' by appending 's' instead of converting to 'ves'", () => {
    expect(plural("dwarf")).toBe("dwarfs");
    expect(plural("roof")).toBe("roofs");
  });
});