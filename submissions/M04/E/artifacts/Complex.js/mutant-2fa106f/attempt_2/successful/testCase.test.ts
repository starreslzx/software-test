describe("Complex atan", () => {
  test("atan(i) is the point at positive imaginary infinity", () => {
    const relativeRoots = [
      "subject_repositories/Complex.js/complex.js",
      "Complex.js/complex.js",
      "complex.js",
    ];

    const complexes: any[] = [];

    for (let depth = 0; depth <= 16; depth++) {
      const prefix = depth === 0 ? "./" : "../".repeat(depth);

      for (const root of relativeRoots) {
        let loaded: any;
        try {
          loaded = jest.requireActual(prefix + root);
        } catch {
          continue;
        }

        let candidate = loaded;
        if (typeof candidate !== "function" && candidate) {
          if (typeof candidate.default === "function") {
            candidate = candidate.default;
          } else if (typeof candidate.Complex === "function") {
            candidate = candidate.Complex;
          }
        }

        if (typeof candidate === "function" && complexes.indexOf(candidate) === -1) {
          complexes.push(candidate);
        }
      }
    }

    expect(complexes.length).toBeGreaterThan(0);

    for (const Complex of complexes) {
      const z = new Complex(0, 1).atan();
      expect(z.re).toBe(0);
      expect(z.im).toBe(Infinity);
    }
  });
});