import { Complex } from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.add infinity handling", () => {
  it("returns NaN when both operands are infinite, but Infinity when only one is infinite", () => {
    const inf = Complex["INFINITY"];

    // Infinity + Infinity = NaN (both infinite)
    const bothInfinite = inf.add(inf);
    expect(bothInfinite.isNaN()).toBe(true);

    // Infinity + finite = Infinity (only one infinite)
    const oneInfinite = inf.add(new Complex(1, 2));
    expect(oneInfinite.isNaN()).toBe(false);
    expect(oneInfinite.isInfinite()).toBe(true);

    // finite + Infinity = Infinity (only one infinite)
    const otherInfinite = new Complex(3, 4).add(inf);
    expect(otherInfinite.isNaN()).toBe(false);
    expect(otherInfinite.isInfinite()).toBe(true);
  });
});