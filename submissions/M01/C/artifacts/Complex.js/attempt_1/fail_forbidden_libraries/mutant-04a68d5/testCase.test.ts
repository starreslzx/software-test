import { describe, it, expect } from "@jest/globals";
import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex sech", () => {
  it("computes sech for a complex number with nonzero real and imaginary parts", () => {
    const z = new Complex(1, 2);
    const result = z.sech();

    const a = 1;
    const b = 2;
    const d = Math.cos(2 * b) + Math.cosh(2 * a);
    const expectedRe = (2 * Math.cosh(a) * Math.cos(b)) / d;
    const expectedIm = (-2 * Math.sinh(a) * Math.sin(b)) / d;

    expect(result.re).toBeCloseTo(expectedRe, 12);
    expect(result.im).toBeCloseTo(expectedIm, 12);
  });
});