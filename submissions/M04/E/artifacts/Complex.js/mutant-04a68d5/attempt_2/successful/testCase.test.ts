type ComplexLike = {
  re: number;
  im: number;
  sech(): ComplexLike;
  isNaN(): boolean;
};

type ComplexCtor = new (re?: number, im?: number) => ComplexLike;

function tryRequire(spec: string): any {
  try {
    return jest.requireActual(spec);
  } catch {
    try {
      return eval("require")(spec);
    } catch {
      return undefined;
    }
  }
}

function loadComplex(): ComplexCtor {
  const repoDirs = ["Complex.js", "complex.js", "Complex.js-master", "complex.js-master"];
  const fileNames = ["complex.js", "Complex.js", "complex", "src/complex.js", "dist/complex.js"];

  for (let depth = 8; depth <= 16; depth++) {
    let prefix = "";
    for (let i = 0; i < depth; i++) {
      prefix += "../";
    }
    for (const repo of repoDirs) {
      for (const file of fileNames) {
        const spec = prefix + "subject_repositories/" + repo + "/" + file;
        const loaded = tryRequire(spec);
        if (typeof loaded === "function") {
          return loaded as ComplexCtor;
        }
        if (loaded && typeof loaded.default === "function") {
          return loaded.default as ComplexCtor;
        }
        if (loaded && typeof loaded.Complex === "function") {
          return loaded.Complex as ComplexCtor;
        }
      }
    }
  }

  throw new Error("Unable to locate the Complex implementation in subject_repositories");
}

describe("Complex.sech", () => {
  it("computes sech(0) as 1 without producing NaN components", () => {
    const Complex = loadComplex();
    const result = new Complex(0, 0).sech();

    expect(result.isNaN()).toBe(false);
    expect(result.re).toBeCloseTo(1, 12);
    expect(result.im).toBeCloseTo(0, 12);
  });
});