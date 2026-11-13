import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex hypot boundary behavior", () => {
  it("computes abs with a component exactly at the 3000 threshold", () => {
    // Original: a < 3000 && b < 3000 is false when b === 3000, so the scaled
    // hypot branch is used: a * sqrt(1 + (b/a)^2) with a = max, b = min/...
    // Mutated: a < 3000 && b <= 3000 is true when b === 3000, so it uses
    // sqrt(a*a + b*b) directly.
    // Choose values where the two branches differ in the last bits.
    const z = new Complex(2999.9999999999995, 3000);
    const result = z.abs();

    // Compute expected using the scaled hypot branch (original behavior).
    const a = Math.abs(2999.9999999999995);
    const b = Math.abs(3000);
    let expected: number;
    if (a < b) {
      const big = b;
      const small = a / b;
      expected = big * Math.sqrt(1 + small * small);
    } else {
      const small = b / a;
      expected = a * Math.sqrt(1 + small * small);
    }

    expect(result).toBe(expected);
  });
});