import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex subtraction with infinity", () => {
  it("returns NaN when subtracting a finite number from infinity", () => {
    const inf = Complex["INFINITY"];

    // Original: first check uses ||, so Infinity - finite => NAN
    // Mutated: first check uses &&, so Infinity - finite falls through
    //          to second check and returns INFINITY
    const result = inf.sub(new Complex(1, 2));
    expect(result.isNaN()).toBe(true);
    expect(result.isInfinite()).toBe(false);
  });
});