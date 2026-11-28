import { Complex } from "../../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex.acsch fallback for a vanishing denominator", () => {
  it("evaluates the real component when the magnitude squared is zero", () => {
    let imaginaryTouched = false;

    const real = {
      valueOf() {
        if (imaginaryTouched) {
          throw new Error("real component evaluated in fallback branch");
        }
        return 0;
      }
    };

    const imaginary = {
      valueOf() {
        imaginaryTouched = true;
        return 0;
      }
    };

    const z = new Complex(real as any, imaginary as any);

    // Ignore coercions performed while parsing the constructor arguments.
    imaginaryTouched = false;

    expect(() => (z as any).acsch()).toThrow(
      "real component evaluated in fallback branch"
    );
  });
});