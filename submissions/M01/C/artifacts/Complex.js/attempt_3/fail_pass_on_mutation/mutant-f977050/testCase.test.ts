import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acosh", () => {
  it("computes acosh correctly when acos result has positive imaginary part", () => {
    // For z = 0.5 + 0.5i, acos(z) has positive imaginary part,
    // so acosh takes the else branch where the mutation lives.
    const z = new Complex(0.5, 0.5);
    const result = z.acosh();

    // Reference: acosh(0.5 + 0.5i) ≈ 0.5306375309525178 + 1.1185178796437059i
    expect(result.re).toBeCloseTo(0.5306375309525178, 10);
    expect(result.im).toBeCloseTo(1.1185178796437059, 10);
    // The mutated code sets res.im = -res[""] = -undefined = NaN,
    // so the imaginary part would not be a finite number.
    expect(Number.isFinite(result.im)).toBe(true);
  });
});