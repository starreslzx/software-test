import * as fs from "fs";
import * as path from "path";

describe("Complex string parsing", () => {
  it("parses an imaginary token followed by a numeric coefficient", () => {
    const starts = [__dirname, process.cwd()];
    let modulePath: string | undefined;

    for (const start of starts) {
      let dir = start;
      while (modulePath === undefined) {
        const candidates = [
          path.join(dir, "subject_repositories", "Complex.js", "complex.js"),
          path.join(dir, "subject_repositories", "complex.js", "complex.js"),
          path.join(dir, "subject_repositories", "Complex", "complex.js"),
          path.join(dir, "subject_repositories", "complex", "complex.js"),
          path.join(dir, "Complex.js", "complex.js"),
          path.join(dir, "complex.js", "complex.js")
        ];

        modulePath = candidates.find((candidate) => fs.existsSync(candidate));
        if (modulePath !== undefined) {
          break;
        }

        const parent = path.dirname(dir);
        if (parent === dir) {
          break;
        }
        dir = parent;
      }
      if (modulePath !== undefined) {
        break;
      }
    }

    if (modulePath === undefined) {
      throw new Error("Unable to locate the Complex.js module");
    }

    const Complex = jest.requireActual(modulePath);
    const z = new Complex("i2");

    expect(z.re).toBe(0);
    expect(z.im).toBe(2);
    expect(z.toString()).toBe("2i");
  });
});