import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.fapply", () => {
  it("applies the promised function with the provided arguments", async () => {
    const add = (a: number, b: number) => a + b;
    const result = await Q.fapply(add, [2, 3]);
    expect(result).toBe(5);
  });
});