import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex string parsing with imaginary unit", () => {
  it("parses '+i3' as 3i", () => {
    const z = new Complex("+i3");
    expect(z.toString()).toBe("3i");
  });
});