const Q = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q.denodeify input validation", () => {
  it("reports a descriptive error when no function is provided", () => {
    expect(() => Q.denodeify()).toThrow("Q can't wrap an undefined function");
  });
});