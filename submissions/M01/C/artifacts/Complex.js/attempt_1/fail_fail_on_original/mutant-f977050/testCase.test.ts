import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acosh", () => {
  it("computes acosh for a value whose acos result has positive imaginary part", () => {
    // Choose z such that acos(z) has im > 0, exercising the else branch of acosh.
    // acos(2) = 0 - i*acosh(2) => im < 0, so use a value with im > 0.
    // For z = 0.5 + 0.5i, acos(z) has positive imaginary part.
    const z = new Complex(0.5, 0.5);
    const result = z.acosh();

    // acosh(0.5 + 0.5i) reference value:
    // re ≈ 0.5306375309525178, im ≈ 0.9045568943023813
    expect(result.re).toBeCloseTo(0.5306375309525178, 10);
    expect(result.im).toBeCloseTo(0.9045568943023813, 10);
  });
});