import * as fs from "fs";
import * as path from "path";

function loadComplexModule(): any {
  let dir = __dirname;
  for (let level = 0; level < 20; level++) {
    const candidate = path.join(dir, "subject_repositories", "Complex.js", "complex.js");
    if (fs.existsSync(candidate)) {
      return require(candidate);
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error("Unable to locate subject_repositories/Complex.js/complex.js");
}

const ComplexModule = loadComplexModule();
const Complex = ComplexModule.Complex || ComplexModule.default || ComplexModule;

describe("Complex.sub involving exactly one infinite operand", () => {
  it("returns positive infinity when a finite complex number is subtracted by an infinite one", () => {
    const result = new Complex(1, 2).sub(new Complex(Infinity, Infinity));

    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });
});