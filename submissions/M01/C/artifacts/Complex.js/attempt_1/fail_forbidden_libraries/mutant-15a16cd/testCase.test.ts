import { describe, it, expect } from "@jest/globals";
import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.ceil with places argument", () => {
  it("should round up to the specified number of decimal places", () => {
    const c = new Complex(1.234, 5.678);
    const result = c.ceil(2);
    expect(result.re).toBeCloseTo(1.24, 10);
    expect(result.im).toBeCloseTo(5.68, 10);
  });
});