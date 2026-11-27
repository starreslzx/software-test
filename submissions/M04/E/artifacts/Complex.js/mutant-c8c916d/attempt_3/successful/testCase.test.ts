import * as fs from "fs";
import * as path from "path";

function loadComplex(): any {
  let dir = __dirname;
  for (let i = 0; i < 30; i++) {
    const candidate = path.join(dir, "subject_repositories", "Complex.js", "complex.js");
    if (fs.existsSync(candidate)) {
      const mod: any = jest.requireActual(candidate);
      return (mod && (mod["default"] || mod["Complex"])) || mod;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error("Unable to locate the Complex.js subject module");
}

const Complex: any = loadComplex();

describe("Complex.acsc", () => {
  it("does not collapse a tiny nonzero real part to zero when its square underflows", () => {
    const result = new Complex(1e-200, 0).acsc();

    expect(result.isNaN()).toBe(true);
  });
});