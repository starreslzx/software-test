import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex parsing of invalid string input", () => {
  it("throws a SyntaxError when the string produces no tokens", () => {
    let error: unknown = null;
    try {
      new Complex("");
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeNull();
    expect((error as Error).name).toBe("SyntaxError");
  });
});