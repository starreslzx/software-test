import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acosh", () => {
  it("computes acosh correctly when acos result has positive imaginary part", () => {
    // Find a value where acos(z) has positive imaginary part so the else branch runs.
    // acos(0.5 + 0.5i) has positive imaginary part.
    const z = new Complex(0.5, 0.5);
    const acosResult = z.acos();
    // Sanity: ensure we are in the else branch (im > 0).
    expect(acosResult.im).toBeGreaterThan(0);

    const result = z.acosh();

    // Reference: acosh(0.5 + 0.5i) ≈ 0.5306375309525178 + 1.1185178796437059i
    expect(result.re).toBeCloseTo(0.5306375309525178, 10);
    expect(result.im).toBeCloseTo(1.1185178796437059, 10);
  });
});