import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex parsing of invalid string input", () => {
  it("throws a SyntaxError when the string contains no parseable tokens", () => {
    let threw = false;
    try {
      new Complex("abc");
    } catch (e) {
      threw = true;
      expect(e).toBeInstanceOf(SyntaxError);
    }
    expect(threw).toBe(true);
  });
});