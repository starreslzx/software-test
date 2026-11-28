import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.acsch", () => {
  it("computes acsch for a pure imaginary input with nonzero imaginary part", () => {
    const result = new Complex(0, 2).acsch();
    expect(result.isNaN()).toBe(false);
    expect(result.isFinite()).toBe(true);
    expect(result.re).toBeCloseTo(0, 10);
    expect(result.im).toBeCloseTo(-Math.asinh(0.5), 10);
  });
});