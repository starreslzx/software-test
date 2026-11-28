import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex hypot boundary behavior", () => {
  it("computes abs differently when one component is exactly 3000", () => {
    // Original: a < 3000 && b < 3000 is false when b === 3000, so the scaled
    // hypot branch is used: a * sqrt(1 + (b/a)^2).
    // Mutated: a < 3000 && b <= 3000 is true when b === 3000, so it uses
    // sqrt(a*a + b*b) directly.
    // Pick values where the two computations differ in floating point.
    const re = 1.0000000000000002;
    const im = 3000;
    const z = new Complex(re, im);
    const result = z.abs();

    // Scaled hypot branch (original behavior):
    const a = Math.abs(re);
    const b = Math.abs(im);
    let expected: number;
    if (a < b) {
      const big = b;
      const small = a / b;
      expected = big * Math.sqrt(1 + small * small);
    } else {
      const small = b / a;
      expected = a * Math.sqrt(1 + small * small);
    }

    // Direct sqrt branch (mutated behavior):
    const mutated = Math.sqrt(a * a + b * b);

    // Sanity: the two branches must actually differ for this input.
    expect(expected).not.toBe(mutated);

    expect(result).toBe(expected);
  });
});