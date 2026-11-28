import * as fs from "fs";
import * as path from "path";

function loadComplexModule(): any {
  const relativeModulePath = path.join(
    "subject_repositories",
    "Complex.js",
    "complex.js"
  );

  let directory = __dirname;

  for (let i = 0; i < 40; i++) {
    const candidate = path.join(directory, relativeModulePath);

    if (fs.existsSync(candidate)) {
      return require(candidate);
    }

    const parent = path.dirname(directory);
    if (parent === directory) {
      break;
    }
    directory = parent;
  }

  throw new Error("Unable to locate the Complex.js module under test");
}

const Complex = loadComplexModule();

describe("Complex.prototype.sub with exactly one infinite operand", () => {
  it("returns the infinity pole when only one operand is infinite", () => {
    const result = new Complex(Infinity, 0).sub(1, 0);

    expect(result.re).toBe(Infinity);
    expect(result.im).toBe(Infinity);
  });
});