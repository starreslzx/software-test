import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex subtraction with infinity", () => {
  it("returns NaN when subtracting finite from infinite (or vice versa)", () => {
    const inf = Complex["INFINITY"];

    // finite - Infinity should be NaN
    const result1 = new Complex(1, 2).sub(inf);
    expect(result1.isNaN()).toBe(true);

    // Infinity - finite should be NaN
    const result2 = inf.sub(new Complex(1, 2));
    expect(result2.isNaN()).toBe(true);

    // finite - Infinity (via two-arg form) should be NaN
    const result3 = new Complex(1, 2).sub(Infinity, Infinity);
    expect(result3.isNaN()).toBe(true);
  });
});