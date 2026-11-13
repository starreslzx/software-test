import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("keeps 'roof' as a regular plural while converting other f/fe words", () => {
    expect(plural("roof")).toBe("roofs");
    expect(plural("dwarf")).toBe("dwarfs");
    expect(plural("leaf")).toBe("leaves");
    expect(plural("knife")).toBe("knives");
  });
});