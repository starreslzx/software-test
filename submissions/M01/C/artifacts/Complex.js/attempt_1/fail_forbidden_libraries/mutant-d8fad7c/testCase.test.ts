import { describe, it, expect } from "@jest/globals";
import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsch", () => {
  it("computes acsch for real non-zero values", () => {
    // acsch(1) = log(1 + sqrt(2)) ≈ 0.881373587019543
    const result = new Complex(1, 0).acsch();
    expect(result.re).toBeCloseTo(Math.log(1 + Math.sqrt(2)), 10);
    expect(result.im).toBeCloseTo(0, 10);

    // acsch(2) = log(2 + sqrt(5)) ≈ 1.4436354751788103
    const result2 = new Complex(2, 0).acsch();
    expect(result2.re).toBeCloseTo(Math.log(2 + Math.sqrt(5)), 10);
    expect(result2.im).toBeCloseTo(0, 10);

    // acsch(-1) = log(-1 + sqrt(2)) ≈ -0.881373587019543
    const result3 = new Complex(-1, 0).acsch();
    expect(result3.re).toBeCloseTo(Math.log(-1 + Math.sqrt(2)), 10);
    expect(result3.im).toBeCloseTo(0, 10);
  });
});