const fs = require("fs");
const path = require("path");

function findComplexModule(): string {
  let dir = __dirname;
  while (true) {
    const candidate = path.join(dir, "subject_repositories", "Complex.js", "complex.js");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error("Could not locate Complex.js in any ancestor directory");
    }
    dir = parent;
  }
}

const Complex = require(findComplexModule());

describe("Complex.ceil", () => {
  it("rounds each component up to the requested number of decimal places", () => {
    const rounded = new Complex(1.234, 5.678).ceil(2);

    expect(rounded.re).toBeCloseTo(1.24, 10);
    expect(rounded.im).toBeCloseTo(5.68, 10);
  });
});