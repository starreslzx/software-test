import plural from "../../../../../../../../../../../subject_repositories/plural/index.js";

describe("plural", () => {
  it("should not apply the man/woman rule to words that merely start with 'man'", () => {
    expect(plural("woman")).toBe("women");
    expect(plural("man")).toBe("men");
    expect(plural("manager")).toBe("managers");
    expect(plural("mansion")).toBe("mansions");
    expect(plural("mandate")).toBe("mandates");
  });
});