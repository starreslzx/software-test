import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.sub infinity handling", () => {
  it("returns INFINITY when subtracting a finite number from infinity", () => {
    const inf = Complex["INFINITY"];
    const finite = new Complex(1, 2);

    const result = inf.sub(finite);

    expect(result.isInfinite()).toBe(true);
    expect(result.toString()).toBe("Infinity");
  });
});