// @ts-nocheck
const path = require("path");
const fs = require("fs");

function findRelativeComplexPath(): string | null {
  let dir = __dirname;
  while (true) {
    const candidate = path.join(dir, "subject_repositories", "Complex.js", "complex.js");
    if (fs.existsSync(candidate)) {
      let rel = path.relative(__dirname, candidate).split(path.sep).join("/");
      if (!rel.startsWith(".")) {
        rel = "./" + rel;
      }
      return rel;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }
}

function loadComplex() {
  const rel = findRelativeComplexPath();
  if (!rel) {
    throw new Error("Unable to locate subject_repositories/Complex.js/complex.js");
  }
  const mod = require(rel);
  return mod && (mod.Complex || mod.default || mod);
}

const Complex = loadComplex();

describe("Complex.acsc", () => {
  it("matches asin(1/z) for a complex number with non-zero imaginary part", () => {
    const z = new Complex(2, 3);

    const actual = z.acsc();
    const expected = z.inverse().asin();

    expect(actual.re).toBeCloseTo(expected.re, 10);
    expect(actual.im).toBeCloseTo(expected.im, 10);
  });
});