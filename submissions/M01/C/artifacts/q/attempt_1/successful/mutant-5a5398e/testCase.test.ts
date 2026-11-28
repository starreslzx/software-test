import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.denodeify", () => {
  it("throws a descriptive error when wrapping an undefined function", () => {
    expect(() => Q.denodeify(undefined)).toThrow(
      "Q can't wrap an undefined function"
    );
  });
});