const plural = require("../../../../../../../../../../../../subject_repositories/plural/index.js");

describe("plural", () => {
  it("treats dwarf and roof as exceptions that simply gain an s rather than becoming ves", () => {
    expect(plural("dwarf")).toBe("dwarfs");
    expect(plural("roof")).toBe("roofs");
  });
});