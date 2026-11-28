import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex subtraction with infinity", () => {
  it("returns Infinity when subtracting finite from infinite", () => {
    const inf = Complex["INFINITY"];

    // In the original code, the first check (||) returns NAN for any infinite operand.
    // In the mutated code (&&), only both-infinite returns NAN; otherwise it falls
    // through to the second check which returns INFINITY.
    // So: Infinity - finite => original: NAN, mutated: INFINITY
    const result = inf.sub(new Complex(1, 2));
    expect(result.isInfinite()).toBe(true);
    expect(result.isNaN()).toBe(false);
  });
});