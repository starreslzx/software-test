// @ts-ignore
const fs = require("fs");
// @ts-ignore
const path = require("path");

function locateComplexJs(): string {
  const startDir: string = typeof __dirname !== "undefined" ? __dirname : process.cwd();
  let dir: string = startDir;

  for (let i = 0; i < 40; i++) {
    const candidate: string = path.join(dir, "subject_repositories", "Complex.js", "complex.js");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent: string = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  throw new Error("Unable to locate subject_repositories/Complex.js/complex.js");
}

// @ts-ignore
const Complex: any = require(locateComplexJs());

describe("Complex.abs when the imaginary magnitude is exactly 3000", () => {
  test("uses the overflow-safe hypot formula at the 3000 boundary", () => {
    for (let re = 0; re < 3000; re++) {
      const actual: number = new Complex(re, 3000).abs();
      const expected: number = 3000 * Math.sqrt(1 + (re / 3000) * (re / 3000));
      expect(actual).toBe(expected);
    }
  });
});