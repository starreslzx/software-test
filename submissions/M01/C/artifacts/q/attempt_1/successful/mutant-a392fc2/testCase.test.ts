import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q finally", () => {
  it("should pass through the fulfillment value when the finally callback is a valid function", async () => {
    const result = await Q(42)["finally"](function () {
      return "ignored";
    });
    expect(result).toBe(42);
  });
});