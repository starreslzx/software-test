import * as fs from "fs";
import * as path from "path";

describe("Complex subtraction with a single infinite operand", () => {
  it("returns Infinity rather than NaN when exactly one operand is infinite", () => {
    const isFile = (p: string): boolean => {
      try {
        return fs.statSync(p).isFile();
      } catch (e) {
        return false;
      }
    };

    const relCandidates: string[][] = [
      ["subject_repositories", "Complex.js", "complex.js"],
      ["subject_repositories", "complex.js"],
      ["Complex.js", "complex.js"],
      ["complex.js"],
    ];

    const ancestors: string[] = [];
    const collect = (start: string) => {
      let dir = start;
      while (true) {
        if (ancestors.indexOf(dir) === -1) {
          ancestors.push(dir);
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
          break;
        }
        dir = parent;
      }
    };

    collect(__dirname);
    collect(process.cwd());

    let modulePath: string | null = null;
    for (const base of ancestors) {
      for (const rel of relCandidates) {
        const candidate = path.join(base, ...rel);
        if (isFile(candidate)) {
          modulePath = candidate;
          break;
        }
      }
      if (modulePath) {
        break;
      }
    }

    if (!modulePath) {
      throw new Error("Unable to locate complex.js for the test");
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(modulePath);
    const ComplexCtor: any =
      (loaded && loaded.default) || (loaded && loaded.Complex) || loaded;

    const leftInfinite = new ComplexCtor(Infinity, 0).sub(1, 0);
    expect(leftInfinite.isNaN()).toBe(false);
    expect(leftInfinite.isInfinite()).toBe(true);
    expect(leftInfinite.toString()).toBe("Infinity");

    const rightInfinite = new ComplexCtor(1, 0).sub(Infinity, 0);
    expect(rightInfinite.isNaN()).toBe(false);
    expect(rightInfinite.isInfinite()).toBe(true);
    expect(rightInfinite.toString()).toBe("Infinity");
  });
});