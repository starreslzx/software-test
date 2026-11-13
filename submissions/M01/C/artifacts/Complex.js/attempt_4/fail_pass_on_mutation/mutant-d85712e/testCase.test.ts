import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex string parsing with imaginary unit", () => {
  it("parses a string like '3+4i' correctly", () => {
    const z = new Complex("3+4i");
    expect(z.re).toBe(3);
    expect(z.im).toBe(4);
  });
});