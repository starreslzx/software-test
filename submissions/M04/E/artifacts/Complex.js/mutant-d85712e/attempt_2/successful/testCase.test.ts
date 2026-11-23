// @ts-nocheck
import * as fs from "fs";
import * as path from "path";

function findComplexSource(): string {
  const layouts = [
    ["subject_repositories", "Complex.js", "complex.js"],
    ["subject_repositories", "complex.js"],
    ["Complex.js", "complex.js"],
  ];

  let dir = __dirname;
  for (let i = 0; i < 60; i++) {
    for (const parts of layouts) {
      const candidate = path.join(dir, ...parts);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error("Could not locate complex.js source file");
}

function toConstructor(mod: any): any {
  if (typeof mod === "function") {
    return mod;
  }
  if (mod && typeof mod.Complex === "function") {
    return mod.Complex;
  }
  if (mod && typeof mod.default === "function") {
    return mod.default;
  }
  return mod;
}

const sourcePath = findComplexSource();
const relativePath = path.relative(__dirname, sourcePath).replace(/\\/g, "/");
const Complex = toConstructor(
  require(relativePath.startsWith(".") ? relativePath : "./" + relativePath)
);

describe("Complex string parser", () => {
  it("parses an imaginary coefficient placed after the i symbol", () => {
    const z = new Complex("i2");

    expect(z.re).toBe(0);
    expect(z.im).toBe(2);
    expect(z.toString()).toBe("2i");
  });
});