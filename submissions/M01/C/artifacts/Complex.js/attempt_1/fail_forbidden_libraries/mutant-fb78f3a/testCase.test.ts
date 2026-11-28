import { describe, it, expect } from "@jest/globals";
import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex asec", () => {
  it("returns 0 for the input 1 (real part 1, imaginary part 0)", () => {
    const result = new Complex(1, 0).asec();
    expect(result.re).toBeCloseTo(0, 10);
    expect(result.im).toBeCloseTo(0, 10);
  });
});