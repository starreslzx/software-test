import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsc", () => {
  it("computes acsc for a value whose squared magnitude underflows to zero", () => {
    // Use a value where a*a + b*b underflows to 0 but a and b are nonzero,
    // forcing the d === 0 fallback branch in acsc.
    const tiny = 1e-200;
    const z = new Complex(tiny, tiny);
    const result = z.acsc();

    // Original fallback builds Complex(a/0, -b/0) = Complex(Infinity, -Infinity)
    // then calls asin(). Mutated fallback builds Complex(0, -b/0) = Complex(0, -Infinity)
    // then calls asin(). Compare the imaginary components, which differ between
    // the two fallbacks.
    const originalFallback = new Complex(Infinity, -Infinity).asin();
    const mutatedFallback = new Complex(0, -Infinity).asin();

    const matchesOriginalIm =
      (Number.isNaN(result.im) && Number.isNaN(originalFallback.im)) ||
      result.im === originalFallback.im;

    const matchesMutatedIm =
      (Number.isNaN(result.im) && Number.isNaN(mutatedFallback.im)) ||
      result.im === mutatedFallback.im;

    expect(matchesOriginalIm).toBe(true);
    expect(matchesMutatedIm).toBe(false);
  });
});