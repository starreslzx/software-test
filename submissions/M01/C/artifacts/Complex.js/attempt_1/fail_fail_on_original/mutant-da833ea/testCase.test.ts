import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex asech", () => {
  it("computes asech for a complex number with non-unit magnitude", () => {
    // z = 2 + 2i, so d = a^2 + b^2 = 8
    // asech(z) = acosh(conj(z)/|z|^2) = acosh((2/8) + (-2/8)i) = acosh(0.25 - 0.25i)
    const z = new Complex(2, 2);
    const result = z.asech();

    // Reference value computed independently:
    // acosh(0.25 - 0.25i) = ln(0.25 - 0.25i + sqrt((0.25-0.25i)^2 - 1))
    // (0.25 - 0.25i)^2 = 0.0625 - 0.125i - 0.0625 = -0.125i
    // sqrt(-0.125i - 1) = sqrt(-1 - 0.125i)
    // Compute sqrt(-1 - 0.125i): r = sqrt(1 + 0.015625) = sqrt(1.015625) ≈ 1.0077822
    // re = sqrt((r + (-1))/2) = sqrt(0.0077822/2) = sqrt(0.0038911) ≈ 0.062379
    // im = sign(-0.125)*sqrt((r - (-1))/2) = -sqrt(2.0077822/2) = -sqrt(1.0038911) ≈ -1.001944
    // w = 0.25 - 0.25i + 0.062379 - 1.001944i = 0.312379 - 1.251944i
    // ln(w) = ln|w| + i*arg(w)
    // |w| = sqrt(0.312379^2 + 1.251944^2) = sqrt(0.097581 + 1.567364) = sqrt(1.664945) ≈ 1.290327
    // ln|w| ≈ 0.254841
    // arg(w) = atan2(-1.251944, 0.312379) ≈ -1.326213
    // So acosh(0.25 - 0.25i) ≈ 0.254841 - 1.326213i

    expect(result.re).toBeCloseTo(0.254841, 4);
    expect(result.im).toBeCloseTo(-1.326213, 4);
  });
});