import Q = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q promise finally", () => {
    it("exposes a finally method that runs cleanup and preserves the fulfillment value", async () => {
        const calls: string[] = [];

        function cleanup() {
            calls.push("cleanup");
            return Q(undefined);
        }
        (cleanup as any).fcall = function () {
            return Q(cleanup());
        };

        const promise: any = Q(42);
        expect(typeof promise["finally"]).toBe("function");

        const value = await promise["finally"](cleanup);

        expect(value).toBe(42);
        expect(calls).toEqual(["cleanup"]);
    });
});