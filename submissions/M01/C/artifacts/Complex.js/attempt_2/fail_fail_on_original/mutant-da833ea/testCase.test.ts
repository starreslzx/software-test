import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex asech", () => {
  it("computes asech for a complex number with non-unit magnitude", () => {
    // z = 2 + 2i, so d = a^2 + b^2 = 8
    // asech(z) = acosh(conj(z)/|z|^2) = acosh(0.25 - 0.25i)
    const z = new Complex(2, 2);
    const result = z.asech();

    // Independently computed reference value for acosh(0.25 - 0.25i):
    // acosh(w) = ln(w + sqrt(w^2 - 1))
    // w = 0.25 - 0.25i
    // w^2 = -0.125i
    // w^2 - 1 = -1 - 0.125i
    // sqrt(-1 - 0.125i) ≈ 0.062379 - 1.001944i
    // w + sqrt(...) ≈ 0.312379 - 1.251944i
    // ln(...) ≈ 0.2548956 - 1.326213i
    expect(result.re).toBeCloseTo(0.2548956, 4);
    expect(result.im).toBeCloseTo(-1.326213, 4);

    // Sanity check: acosh(cosh(asech(z))) should return conj(z)/|z|^2
    const roundTrip = result.cosh();
    expect(roundTrip.re).toBeCloseTo(0.25, 6);
    expect(roundTrip.im).toBeCloseTo(-0.25, 6);
  });
});