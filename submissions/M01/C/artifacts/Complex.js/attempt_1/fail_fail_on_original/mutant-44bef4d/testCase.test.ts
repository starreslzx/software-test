import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsc", () => {
  it("computes the arcus cosecans of a non-zero complex number", () => {
    const result = new Complex(2, 1).acsc();
    const expected = new Complex(2, 1).asin().div(new Complex(2, 1));

    expect(result.re).toBeCloseTo(expected.re, 10);
    expect(result.im).toBeCloseTo(expected.im, 10);
  });
});