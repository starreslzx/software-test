import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsc", () => {
  it("computes acsc for a value whose squared magnitude underflows to zero", () => {
    // Use a value where a*a + b*b underflows to 0 but a and b are nonzero,
    // forcing the d === 0 fallback branch in acsc.
    const tiny = 1e-200;
    const z = new Complex(tiny, tiny);
    const result = z.acsc();

    // Original: fallback builds Complex(a/0, -b/0) = Complex(Infinity, -Infinity)
    // Mutated: fallback builds Complex(0, -b/0) = Complex(0, -Infinity)
    // The resulting complex values differ, so at least one observable component
    // must differ between the two implementations. Assert the exact real part.
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
    // Sanity: the result must not equal what the mutated fallback would produce.
    // Mutated fallback -> Complex(0, -Infinity).asin()
    const mutatedFallback = new Complex(0, -Infinity).asin();
    const sameAsMutated =
      (Number.isNaN(result.re) && Number.isNaN(mutatedFallback.re)) ||
      result.re === mutatedFallback.re;
    expect(sameAsMutated).toBe(false);
  });
});