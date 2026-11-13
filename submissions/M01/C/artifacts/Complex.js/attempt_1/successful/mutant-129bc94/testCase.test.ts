import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex module export", () => {
  it("exposes the Complex constructor as a named property on the exported function", () => {
    expect(typeof Complex).toBe("function");
    expect((Complex as any)["Complex"]).toBe(Complex);
  });
});