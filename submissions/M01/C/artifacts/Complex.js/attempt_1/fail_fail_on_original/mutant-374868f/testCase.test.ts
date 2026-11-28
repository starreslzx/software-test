import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex asech", () => {
  it("computes the inverse hyperbolic secant of a non-zero complex number", () => {
    const z = new Complex(2, 1);
    const result = z.asech();

    // asech(2 + i) computed independently:
    // 1/z = (2 - i)/5 = 0.4 - 0.2i
    // acosh(0.4 - 0.2i)
    const inv = new Complex(0.4, -0.2);
    const expected = inv.acosh();

    expect(result.re).toBeCloseTo(expected.re, 10);
    expect(result.im).toBeCloseTo(expected.im, 10);

    // Sanity check against a known value: asech(2) = ln(2 + sqrt(3)) ≈ 1.3169578969248166
    const realResult = new Complex(2, 0).asech();
    expect(realResult.re).toBeCloseTo(1.3169578969248166, 10);
    expect(realResult.im).toBeCloseTo(0, 10);
  });
});