import * as ComplexModule from "../../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

const Complex = (ComplexModule as any).default || ComplexModule;

describe("Complex.acsch on the real axis", () => {
  it("computes the inverse hyperbolic cosecant of a nonzero real number instead of returning infinity", () => {
    const result = new Complex(2, 0).acsch();

    expect(result.isFinite()).toBe(true);
    expect(result.im).toBe(0);
    expect(result.re).toBeCloseTo(Math.log(2 + Math.sqrt(2 * 2 + 1)), 12);
  });
});