import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex hypot boundary behavior", () => {
  it("computes abs consistently when one component equals 3000", () => {
    // Original: a < 3000 && b < 3000 -> false when b === 3000, uses scaled hypot
    // Mutated:  a < 3000 && b <= 3000 -> true when b === 3000, uses sqrt(a*a+b*b)
    const z = new Complex(3000, 3000);
    const result = z.abs();
    const expected = 3000 * Math.sqrt(2);
    expect(result).toBeCloseTo(expected, 10);
    expect(result).toBe(expected);
  });
});