import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex subtraction with infinity", () => {
  it("returns NaN when subtracting finite from infinite", () => {
    const inf = Complex["INFINITY"];

    // Infinity - finite should be NaN (both infinite check: || in original)
    const result = inf.sub(new Complex(1, 2));
    expect(result.isNaN()).toBe(true);
  });
});