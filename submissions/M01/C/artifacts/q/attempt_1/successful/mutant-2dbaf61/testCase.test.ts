import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q long stack traces", () => {
  it("includes the source promise's stack in the rejection stack when longStackSupport is enabled", async () => {
    Q.longStackSupport = true;
    try {
      const error = await Q.reject(new Error("boom"))
        .then(() => {
          throw new Error("should not happen");
        })
        .catch((err: Error) => err);

      expect(error).toBeInstanceOf(Error);
      expect(typeof error.stack).toBe("string");
      expect(error.stack).toContain("boom");
      expect(error.stack).toContain("From previous event:");
    } finally {
      Q.longStackSupport = false;
    }
  });
});