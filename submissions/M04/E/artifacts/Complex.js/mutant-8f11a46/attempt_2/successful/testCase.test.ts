import { Complex } from "../../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex string parsing", () => {
  it("throws a SyntaxError for invalid string input", () => {
    expect(() => new Complex("1x")).toThrow(SyntaxError);
  });
});