import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex parsing of invalid string input", () => {
  it("throws a SyntaxError when the string contains no parseable tokens", () => {
    expect(() => new Complex("abc")).toThrow(SyntaxError);
  });
});