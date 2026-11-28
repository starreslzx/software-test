declare const require: any;

function loadComplex(): any {
  const candidates: string[] = [];
  const parent = (count: number) =>
    count === 0 ? "." : new Array(count).fill("..").join("/");

  // Locations within the generated test artifact tree.
  for (let depth = 0; depth <= 4; depth++) {
    candidates.push(`${parent(depth)}/complex.js`);
  }

  // Common locations for the checked-out subject repository.
  for (let depth = 8; depth <= 12; depth++) {
    const base = parent(depth);
    candidates.push(`${base}/subject_repositories/Complex.js/complex.js`);
    candidates.push(`${base}/subject_repositories/complex.js/complex.js`);
    candidates.push(`${base}/subject_repositories/Complex.js/src/complex.js`);
    candidates.push(`${base}/subject_repositories/complex.js/src/complex.js`);
  }

  // Broader fallbacks up the directory tree.
  for (let depth = 5; depth <= 12; depth++) {
    candidates.push(`${parent(depth)}/complex.js`);
  }

  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      // Try the next candidate location.
    }
  }

  throw new Error("Unable to load complex.js");
}

const ComplexModule = loadComplex();
const Complex = ComplexModule.Complex || ComplexModule.default || ComplexModule;

describe("Complex.prototype.floor", () => {
  it("floors the real and imaginary parts to the requested precision", () => {
    const value = new Complex(1.234, -2.789);
    const floored = value.floor(2);

    expect(floored.re).not.toBeNaN();
    expect(floored.re).toBeCloseTo(1.23, 10);
    expect(floored.im).toBeCloseTo(-2.79, 10);
  });
});