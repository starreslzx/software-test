// @ts-ignore
import Complex from "../../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.acsc", () => {
  it("computes the inverse cosecant of a nonzero real number", () => {
    const result = new Complex(2, 0).acsc();

    expect(result.re).toBeCloseTo(Math.PI / 6, 12);
    expect(result.im).toBeCloseTo(0, 12);
    expect(Number.isFinite(result.re)).toBe(true);
    expect(Number.isFinite(result.im)).toBe(true);
  });
});