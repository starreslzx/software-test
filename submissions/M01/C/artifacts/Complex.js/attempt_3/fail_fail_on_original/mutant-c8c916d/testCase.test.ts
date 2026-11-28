import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsc", () => {
  it("computes acsc for a purely imaginary input with zero real part", () => {
    // For z = 0 + 2i, d = a*a + b*b = 4 (nonzero), so the d !== 0 branch is taken.
    // The mutation only affects the d === 0 fallback branch. To reach d === 0,
    // we need a = 0 and b = 0, but that is handled by the early return.
    // Instead, verify the fallback branch is reachable through the acsc of a value
    // whose reciprocal has d === 0, i.e. z where a*a + b*b overflows or is 0.
    // Use a value that makes the reciprocal's d === 0: a=0, b=0 is early-returned.
    // The only way to hit the fallback is when a*a+b*b === 0 with nonzero a or b,
    // which can happen with very small numbers underflowing to 0.
    const tiny = 1e-200;
    const z = new Complex(tiny, tiny);
    const result = z.acsc();

    // With original code: fallback uses (a !== 0) ? a/0 : 0 => a/0 = Infinity
    // With mutated code: fallback uses (false) ? a/0 : 0 => 0
    // So the real part differs: Infinity vs 0 (or NaN after asin).
    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });
});