import * as fs from "fs";
import * as path from "path";

const TARGET = path.join("subject_repositories", "Complex.js", "complex.js");

function walkUp(start: string): string | null {
  let dir = start;
  while (true) {
    const candidate = path.join(dir, TARGET);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }
}

function locateComplexModule(): string {
  const fromDirname = walkUp(__dirname);
  if (fromDirname) {
    return fromDirname;
  }
  const fromCwd = walkUp(process.cwd());
  if (fromCwd) {
    return fromCwd;
  }
  throw new Error("Unable to locate module at " + TARGET);
}

describe("Complex.js CommonJS export interop flag", () => {
  it("exposes the Complex constructor with __esModule marked as true", () => {
    const modulePath = locateComplexModule();
    const Complex = require(modulePath);

    // The exported value is the constructor function itself.
    expect(typeof Complex).toBe("function");

    // Default-import interop relies on this flag being truthy.
    expect(Complex.__esModule).toBe(true);

    // Sanity check that the constructor behaves correctly through the located module.
    const z = new Complex(2, 3);
    expect(z.re).toBe(2);
    expect(z.im).toBe(3);
    expect(z.toString()).toBe("2 + 3i");
  });
});