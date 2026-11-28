function tryRequire(modulePath: string): any {
  try {
    return require(modulePath);
  } catch {
    return undefined;
  }
}

function loadComplex(): any {
  const patterns: string[][] = [
    ["subject_repositories", "Complex.js", "complex.js"],
    ["Complex.js", "complex.js"],
    ["complex.js"],
  ];

  for (const pattern of patterns) {
    for (let level = 0; level < 25; level++) {
      const prefix = level === 0 ? "./" : "../".repeat(level);
      const modulePath = prefix + pattern.join("/");
      const loaded = tryRequire(modulePath);
      if (loaded) {
        return loaded;
      }
    }
  }

  throw new Error("Could not locate complex.js module");
}

const Complex = loadComplex();

describe("Complex.prototype.asech", () => {
  it("returns acosh of the reciprocal for a purely imaginary input", () => {
    const z = new Complex(0, 2);

    // reciprocal of 0 + 2i is 0 - 0.5i, so asech should equal acosh(0 - 0.5i)
    const expected = new Complex(0, -0.5).acosh();

    const actual = z.asech();

    expect(actual.re).toBeCloseTo(expected.re, 12);
    expect(actual.im).toBeCloseTo(expected.im, 12);
  });
});