import * as fs from "fs";
import * as path from "path";

describe("plural", () => {
  it("does not apply the irregular man/woman rule to words that merely start with 'man'", () => {
    function locatePluralModule(): string {
      let dir = __dirname;
      while (true) {
        const candidate = path.join(dir, "subject_repositories", "plural", "index.js");
        if (fs.existsSync(candidate)) {
          return candidate;
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
          break;
        }
        dir = parent;
      }
      throw new Error("Unable to locate subject_repositories/plural/index.js");
    }

    const plural = require(locatePluralModule()) as (word: string, num?: number) => string;

    expect(plural("mane")).toBe("manes");
  });
});