import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex csc", () => {
  it("computes the cosecant of a complex number correctly", () => {
    const a = 1;
    const b = 1;

    const cosh = (x: number) => (Math.exp(x) + Math.exp(-x)) * 0.5;
    const sinh = (x: number) => (Math.exp(x) - Math.exp(-x)) * 0.5;

    const d = 0.5 * cosh(2 * b) - 0.5 * Math.cos(2 * a);
    const expectedRe = (Math.sin(a) * cosh(b)) / d;
    const expectedIm = (-Math.cos(a) * sinh(b)) / d;

    const result = new Complex(a, b).csc();

    expect(result.re).toBeCloseTo(expectedRe, 12);
    expect(result.im).toBeCloseTo(expectedIm, 12);
  });
});