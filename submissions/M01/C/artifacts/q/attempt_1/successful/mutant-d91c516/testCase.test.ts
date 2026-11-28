import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.keys", () => {
  it("returns a promise resolving to the object's own enumerable keys", async () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys = await Q.keys(obj);
    expect(keys.sort()).toEqual(["a", "b", "c"]);
  });
});