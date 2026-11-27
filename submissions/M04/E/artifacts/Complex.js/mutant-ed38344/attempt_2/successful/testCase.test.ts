// @ts-ignore
const nodeRequire = require;

const Complex = (() => {
  for (let depth = 8; depth <= 16; depth++) {
    const modulePath = "../".repeat(depth) + "subject_repositories/Complex.js/complex.js";
    try {
      return nodeRequire(modulePath);
    } catch (e) {
      // Try the next possible location
    }
  }
  throw new Error("Unable to load Complex.js");
})();

describe("Complex.prototype.sub with infinities", () => {
  it("returns Infinity when exactly one operand is infinite", () => {
    const infinite = new Complex(Infinity, Infinity);
    const finite = new Complex(3, 4);

    expect(infinite.sub(finite).toString()).toBe("Infinity");
    expect(finite.sub(infinite).toString()).toBe("Infinity");
  });
});