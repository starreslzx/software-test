const Q = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q.join", () => {
  it("resolves when both values are identical and rejects when they differ", async () => {
    const joined = await Q.join(42, 42);
    expect(joined).toBe(42);

    let rejection: any;
    try {
      await Q.join("a", "b");
    } catch (error) {
      rejection = error;
    }

    expect(rejection).toBeInstanceOf(Error);
    expect(rejection.message).toContain("not the same");
  });
});