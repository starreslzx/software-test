import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex asech", () => {
  it("computes the inverse hyperbolic secant of a non-zero complex number", () => {
    const z = new Complex(2, 1);
    const result = z.asech();

    // asech(z) = acosh(1/z) = acosh((2 - i)/5) = acosh(0.4 - 0.2i)
    const expected = new Complex(0.4, -0.2).acosh();

    expect(result.re).toBeCloseTo(expected.re, 10);
    expect(result.im).toBeCloseTo(expected.im, 10);

    // The result must be a finite, non-trivial complex number
    expect(Number.isFinite(result.re)).toBe(true);
    expect(Number.isFinite(result.im)).toBe(true);
    expect(Math.abs(result.re)).toBeGreaterThan(0.1);
  });
});