import * as fs from "fs";
import * as path from "path";

function locateComplexJs(): string {
  let dir = __dirname;
  for (let i = 0; i < 50; i++) {
    const candidate = path.join(
      dir,
      "subject_repositories",
      "Complex.js",
      "complex.js",
    );
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error("Could not locate subject_repositories/Complex.js/complex.js");
}

// @ts-ignore
const Complex = require(locateComplexJs());

describe("Complex csc", () => {
  it("returns the reciprocal of sin(z) for z = 1 + i", () => {
    const a = 1;
    const b = 1;
    const z = new Complex(a, b);
    const result = z.csc();

    const sinRe = Math.sin(a) * Math.cosh(b);
    const sinIm = Math.cos(a) * Math.sinh(b);
    const magnitudeSquared = sinRe * sinRe + sinIm * sinIm;

    expect(result.re).toBeCloseTo(sinRe / magnitudeSquared, 10);
    expect(result.im).toBeCloseTo(-sinIm / magnitudeSquared, 10);
  });
});