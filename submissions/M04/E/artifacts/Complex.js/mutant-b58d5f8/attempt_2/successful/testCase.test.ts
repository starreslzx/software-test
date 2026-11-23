import Complex = require("../../../../../../../../../../../../subject_repositories/Complex.js/complex.js");

describe("Complex string parsing", () => {
  it("throws a SyntaxError for strings that cannot be tokenized as a complex number", () => {
    expect(() => new Complex("\n")).toThrowError(SyntaxError);
  });
});