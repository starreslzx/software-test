import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q promise finally", () => {
    it("invokes the finally callback and preserves the fulfillment value", async () => {
        const callback = jest.fn(() => Q.resolve());
        const result = await Q.resolve(42)["finally"](callback);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(result).toBe(42);
    });
});