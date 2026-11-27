import * as fs from "fs";
import * as path from "path";

function findComplexModule(start: string): string | null {
  const relativeLocations = [
    path.join("subject_repositories", "Complex.js", "complex.js"),
    path.join("subject_repositories", "complex.js", "complex.js"),
  ];

  let directory = start;
  for (let depth = 0; depth < 40; depth++) {
    for (const relativeLocation of relativeLocations) {
      const candidate = path.join(directory, relativeLocation);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
    const parentDirectory = path.dirname(directory);
    if (parentDirectory === directory) {
      break;
    }
    directory = parentDirectory;
  }

  return null;
}

const complexPath =
  findComplexModule(__dirname) || findComplexModule(process.cwd());

if (complexPath === null) {
  throw new Error("Could not locate subject_repositories/Complex.js/complex.js");
}

const Complex = require(complexPath);

describe("Complex module exports", () => {
  it("exposes the Complex constructor as a named static property", () => {
    expect(Complex.Complex).toBe(Complex);
  });
});