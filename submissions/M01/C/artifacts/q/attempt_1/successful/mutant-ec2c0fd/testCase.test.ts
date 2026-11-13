import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.async", () => {
  it("resolves the return value of an ES6 generator function", async () => {
    const result = await Q.async(function* () {
      const a = yield Q(1);
      const b = yield Q(2);
      return a + b;
    })();

    expect(result).toBe(3);
  });
});