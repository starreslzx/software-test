import * as fs from "fs";
import * as path from "path";

function findSubjectComplex(): string {
  let dir = __dirname;
  for (let i = 0; i < 30; i++) {
    const candidate = path.join(dir, "subject_repositories", "Complex.js", "complex.js");
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

const imported = require(findSubjectComplex());
const Complex = imported.Complex || imported;

describe("Complex.asec", () => {
  it("computes the arcsecant of a positive real number instead of returning infinity", () => {
    const result = new Complex(2, 0).asec();
    expect(result.isInfinite()).toBe(false);
    expect(result.re).toBeCloseTo(Math.PI / 3, 10);
    expect(result.im).toBeCloseTo(0, 10);
  });
});