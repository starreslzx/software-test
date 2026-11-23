// @ts-ignore
const nodePath = require("path");

function upLevels(n: number): string {
  let prefix = "";
  for (let i = 0; i < n; i++) {
    prefix += "../";
  }
  return prefix;
}

function loadComplex(): any {
  // @ts-ignore
  const cwd: string = process.cwd();
  const candidates: string[] = [
    nodePath.resolve(cwd, "subject_repositories/Complex.js/complex.js"),
    nodePath.resolve(cwd, "../subject_repositories/Complex.js/complex.js"),
    nodePath.resolve(cwd, "../../subject_repositories/Complex.js/complex.js"),
    nodePath.resolve(cwd, "../../../subject_repositories/Complex.js/complex.js"),
    nodePath.resolve(cwd, "../../../../subject_repositories/Complex.js/complex.js"),
  ];
  for (let i = 8; i <= 18; i++) {
    candidates.push(upLevels(i) + "subject_repositories/Complex.js/complex.js");
  }
  for (let j = 0; j < candidates.length; j++) {
    try {
      // @ts-ignore
      return require(candidates[j]);
    } catch (e) {
      void e;
    }
  }
  throw new Error("Unable to locate complex.js");
}

const loaded = loadComplex();
const Complex = loaded && loaded.default ? loaded.default : loaded;

describe("Complex.prototype.csc", () => {
  it("computes the cosecant using the standard hyperbolic formula", () => {
    const re = Math.PI / 6;
    const im = 1;
    const z = new Complex(re, im);
    const result = z.csc();

    const d = 0.5 * Math.cosh(2 * im) - 0.5 * Math.cos(2 * re);
    const expectedRe = Math.sin(re) * Math.cosh(im) / d;
    const expectedIm = -Math.cos(re) * Math.sinh(im) / d;

    expect(result.re).toBeCloseTo(expectedRe, 12);
    expect(result.im).toBeCloseTo(expectedIm, 12);
  });
});