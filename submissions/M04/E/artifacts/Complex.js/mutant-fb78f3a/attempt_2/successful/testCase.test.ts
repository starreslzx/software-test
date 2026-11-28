export {};

declare const require: (modulePath: string) => any;

function loadComplex(): any {
  const candidates = [
    "../../../../../../../../../../subject_repositories/Complex.js/complex.js",
    "../../../../../../../../../../../subject_repositories/Complex.js/complex.js",
    "../../../../../../../../../../../../subject_repositories/Complex.js/complex.js",
    "../../../../../../../../../../subject_repositories/complex.js/complex.js",
    "../../../../../../../../../../../subject_repositories/complex.js/complex.js",
    "../../../../../../../../../../../../subject_repositories/complex.js/complex.js",
  ];

  for (let i = 0; i < candidates.length; i++) {
    try {
      const mod = require(candidates[i]);
      if (mod && mod.default) {
        return mod.default;
      }
      return mod;
    } catch (err) {
      void err;
    }
  }

  throw new Error("Unable to load Complex.js");
}

const Complex = loadComplex();

describe("Complex asec", () => {
  it("returns the principal arcsecant for real numbers", () => {
    const atZero = new Complex(0, 0).asec();
    expect(atZero.re).toBe(0);
    expect(atZero.im).toBe(Infinity);

    const atTwo = new Complex(2, 0).asec();
    expect(atTwo.re).toBeCloseTo(Math.PI / 3, 12);
    expect(atTwo.im).toBeCloseTo(0, 12);
  });
});