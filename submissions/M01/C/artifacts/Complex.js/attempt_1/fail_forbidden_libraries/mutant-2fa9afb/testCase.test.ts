import { describe, it, expect } from "@jest/globals";
import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsc", () => {
  it("computes acsc for non-zero inputs and handles zero specially", () => {
    // Non-zero input: acsc(1) should be a finite complex value (pi/2, 0)
    const r1 = new Complex(1, 0).acsc();
    expect(Number.isFinite(r1.re)).toBe(true);
    expect(Number.isFinite(r1.im)).toBe(true);
    expect(r1.re).toBeCloseTo(Math.PI / 2, 10);
    expect(r1.im).toBeCloseTo(0, 10);

    // Another non-zero input: acsc(2)
    const r2 = new Complex(2, 0).acsc();
    expect(Number.isFinite(r2.re)).toBe(true);
    expect(Number.isFinite(r2.im)).toBe(true);
    expect(r2.re).toBeCloseTo(Math.asin(1 / 2), 10);
    expect(r2.im).toBeCloseTo(0, 10);

    // Zero input: acsc(0) should be (pi/2, Infinity)
    const r0 = new Complex(0, 0).acsc();
    expect(r0.re).toBeCloseTo(Math.PI / 2, 10);
    expect(r0.im).toBe(Infinity);
  });
});