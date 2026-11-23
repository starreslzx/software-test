import { Complex } from "../../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.abs hypot at the 3000 boundary", () => {
  it("uses the stable hypot computation when the imaginary part equals 3000", () => {
    for (let i = 1; i <= 20000; i++) {
      const x = i / 10;
      const expected = 3000 * Math.sqrt(1 + (x / 3000) * (x / 3000));
      expect(new Complex(x, 3000).abs()).toBe(expected);
    }
  });
});