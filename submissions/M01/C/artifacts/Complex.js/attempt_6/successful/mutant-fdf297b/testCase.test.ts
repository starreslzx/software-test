import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex subtraction with infinity", () => {
  it("returns the infinity pole when subtracting an infinite number from a finite one", () => {
    // Original: the second guard uses `||`, so any infinite operand yields
    //           Complex.INFINITY, i.e. (Infinity, Infinity).
    // Mutated:  the second guard uses `&&`, so a single infinite operand falls
    //           through to the plain component-wise subtraction, producing
    //           (1 - Infinity, 2 - 0) = (-Infinity, 2).
    const result = new Complex(1, 2).sub(new Complex(Infinity, 0));

    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });
});