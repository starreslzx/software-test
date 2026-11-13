import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.acsch", () => {
  it("computes acsch for a tiny complex input where the squared magnitude underflows to zero", () => {
    const result = new Complex(1e-200, 1e-200).acsch();
    expect(result.isNaN()).toBe(true);
    expect(result.re).toBeNaN();
    expect(result.im).toBeNaN();
    expect(result.toString()).toBe("NaN");
  });
});