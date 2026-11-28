import { existsSync } from "fs";
import { join, dirname } from "path";
import { createRequire } from "module";

function findComplexModule(): string {
  const candidates = [
    ["subject_repositories", "Complex.js", "complex.js"],
    ["subject_repositories", "complex.js", "complex.js"],
    ["subject_repositories", "Complex.js", "Complex.js"],
    ["subject_repositories", "complex.js"],
    ["Complex.js", "complex.js"],
    ["complex.js", "complex.js"],
  ];

  let dir = __dirname;
  for (let depth = 0; depth < 40; depth++) {
    for (const parts of candidates) {
      const candidatePath = join(dir, ...parts);
      if (existsSync(candidatePath)) {
        return candidatePath;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error("Unable to locate complex.js");
}

const nodeRequire = createRequire(__filename);
const Complex: any = nodeRequire(findComplexModule());

describe("Complex asech", () => {
  test("computes asech of 2 as i*pi/3", () => {
    const result = new Complex(2, 0).asech();

    expect(result.re).toBeCloseTo(0, 12);
    expect(result.im).toBeCloseTo(Math.PI / 3, 12);
  });
});