import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.js module export marker", () => {
  it("marks the exported Complex constructor as an ES module via __esModule", () => {
    expect((Complex as any).__esModule).toBe(true);
  });
});