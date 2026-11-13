import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex floor", () => {
  it("floors the real and imaginary parts with the given precision", () => {
    const z = new Complex(1.2345, -6.7891);
    const result = z.floor(2);
    expect(result.re).toBeCloseTo(1.23, 10);
    expect(result.im).toBeCloseTo(-6.79, 10);
  });
});