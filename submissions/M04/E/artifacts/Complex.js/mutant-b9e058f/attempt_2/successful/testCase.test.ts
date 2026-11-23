import Complex from "../../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.add", () => {
  it("returns Infinity when adding a finite value to an infinite value", () => {
    const sum = new Complex(2, 3).add(Complex.INFINITY);

    expect(sum.isNaN()).toBe(false);
    expect(sum.isInfinite()).toBe(true);
    expect(sum.toString()).toBe("Infinity");
  });
});