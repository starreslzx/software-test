import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex parser validation", () => {
  it("throws SyntaxError for malformed string input with invalid tokens", () => {
    expect(() => new Complex("1+2i3")).toThrow(SyntaxError);
    expect(() => new Complex("abc")).toThrow(SyntaxError);
    expect(() => new Complex("1+")).toThrow(SyntaxError);
  });
});