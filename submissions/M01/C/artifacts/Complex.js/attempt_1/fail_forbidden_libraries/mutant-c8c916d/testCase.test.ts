import { describe, it, expect } from "@jest/globals";
import Complex from "../../../../../../../../../../../subject_repositories/Complex.js/complex.js";

describe("Complex acsc", () => {
  it("computes acsc for a purely imaginary input with nonzero real part handling", () => {
    // For z = 0 + 2i, acsc(z) should be finite and well-defined.
    // The mutation changes the fallback branch (d === 0) to always use 0 for the real part,
    // which affects the d === 0 path. We exercise a value where d !== 0 to ensure
    // the normal path is used, but also verify behavior that depends on the branch structure.
    const z = new Complex(0, 2);
    const result = z.acsc();

    // acsc(2i) = asin(1/(2i)) = asin(-0.5i)
    // asin(-0.5i) = -i * asinh(0.5) ... let's compute reference.
    // asin(z) = -i ln(iz + sqrt(1 - z^2))
    // For z = -0.5i: iz = 0.5, z^2 = -0.25, 1 - z^2 = 1.25, sqrt = 1.118033988749895
    // ln(0.5 + 1.118033988749895) = ln(1.618033988749895) = 0.48121182505960347
    // -i * 0.48121182505960347 = -0.48121182505960347 i
    expect(result.re).toBeCloseTo(0, 10);
    expect(result.im).toBeCloseTo(-0.48121182505960347, 10);
  });
});