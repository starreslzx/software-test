// @ts-ignore
const nodeRequire: (id: string) => any = require;

function loadComplex(): any {
  for (let depth = 8; depth <= 18; depth++) {
    const candidate = "../".repeat(depth) + "subject_repositories/Complex.js/complex.js";
    try {
      return nodeRequire(candidate);
    } catch (err) {
      // try the next possible relative location
    }
  }
  throw new Error("Could not locate the Complex.js subject repository");
}

const ComplexModule = loadComplex();
const Complex = ComplexModule.default || ComplexModule;

describe("Complex parsing of invalid strings", () => {
  it("throws a SyntaxError when constructed from an empty string", () => {
    expect(() => new Complex("")).toThrow(SyntaxError);
  });
});