import { Complex } from "../../../../../../../../../../../../docker_output/subject_repositories/Complex.js/complex.js";

describe("Complex sinh behavior", () => {
  it("computes sinh correctly for a large positive value", () => {
    // For x = 2, sinh(2) = (e^2 - e^-2) / 2 ≈ 3.626860407847019
    const result = new Complex(2, 0).sinh();
    expect(result.re).toBeCloseTo(3.626860407847019, 10);
    expect(result.im).toBeCloseTo(0, 10);
  });
});