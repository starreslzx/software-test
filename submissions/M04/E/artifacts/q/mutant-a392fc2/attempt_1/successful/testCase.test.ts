// @ts-ignore
const Q = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q promise finally", () => {
    it("runs the finally callback and preserves the fulfillment value", async () => {
        let called = 0;

        const result = await Q("hello").finally(function () {
            called += 1;
        });

        expect(called).toBe(1);
        expect(result).toBe("hello");
    });
});