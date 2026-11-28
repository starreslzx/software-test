import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsc", () => {
  it("computes acsc for a value whose squared magnitude underflows to zero", () => {
    // Use a value where a*a + b*b underflows to 0 but a and b are nonzero,
    // forcing the d === 0 fallback branch in acsc.
    const tiny = 1e-200;
    const z = new Complex(tiny, tiny);
    const result = z.acsc();

    // Original: fallback builds Complex(a/0, -b/0) = Complex(Infinity, -Infinity)
    // then calls asin() on it, producing a NaN real part but a non-NaN imaginary part.
    // Mutated: fallback builds Complex(0, -b/0) = Complex(0, -Infinity),
    // producing a different result.
    // Distinguish by checking the imaginary component differs.
    expect(Number.isNaN(result.re)).toBe(true);
    expect(Number.isNaN(result.im)).toBe(false);
  });
});