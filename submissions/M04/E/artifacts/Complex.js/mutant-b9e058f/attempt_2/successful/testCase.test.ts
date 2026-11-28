function loadComplex(): any {
  for (let depth = 1; depth <= 20; depth++) {
    const candidate =
      "../".repeat(depth) + "subject_repositories/Complex.js/complex.js";
    try {
      // @ts-ignore
      return require(candidate);
    } catch (e) {
      // try the next depth
    }
  }
  throw new Error("Unable to load complex.js");
}

const Complex = loadComplex();

describe("Complex.add", () => {
  test("adding a finite value to infinity yields infinity", () => {
    const sum1 = Complex.INFINITY.add(42);
    expect(sum1.isInfinite()).toBe(true);
    expect(sum1.isNaN()).toBe(false);
    expect(sum1.toString()).toBe("Infinity");

    const sum2 = new Complex(3, 4).add(Complex.INFINITY);
    expect(sum2.isInfinite()).toBe(true);
    expect(sum2.isNaN()).toBe(false);
  });
});