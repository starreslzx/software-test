import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsc", () => {
  it("computes acsc for a purely imaginary input", () => {
    const z = new Complex(0, 2);
    const result = z.acsc();

    expect(result.re).toBeCloseTo(0, 10);
    expect(result.im).toBeCloseTo(-0.48121182505960347, 10);
  });
});