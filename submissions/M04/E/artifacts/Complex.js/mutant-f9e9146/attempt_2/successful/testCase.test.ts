import * as fs from "fs";
import * as path from "path";

describe("Complex.js ES module interoperability", () => {
  it("flags the exported Complex constructor as an ES module export", () => {
    const startingPoints = [__dirname, process.cwd()];
    let filePath: string | undefined;

    for (const start of startingPoints) {
      let dir = start;
      while (true) {
        const candidate = path.join(
          dir,
          "subject_repositories",
          "Complex.js",
          "complex.js"
        );

        if (fs.existsSync(candidate)) {
          filePath = candidate;
          break;
        }

        const parent = path.dirname(dir);
        if (parent === dir) {
          break;
        }
        dir = parent;
      }

      if (filePath) {
        break;
      }
    }

    expect(filePath).toBeDefined();

    // @ts-ignore: load the plain JavaScript module without type declarations
    const loadedModule = require(filePath as string);
    const Complex =
      loadedModule && loadedModule.default ? loadedModule.default : loadedModule;

    // Sanity check that we loaded the Complex constructor.
    expect(typeof Complex).toBe("function");
    expect(new Complex(1, 2).re).toBe(1);

    // The export advertises itself as an ES module (Node/Babel interop flag).
    expect(Complex.__esModule).toBe(true);
  });
});