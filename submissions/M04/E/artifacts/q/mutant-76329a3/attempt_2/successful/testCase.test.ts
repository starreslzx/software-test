const Q = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q.fbind", () => {
    it("combines pre-bound arguments with later call arguments and preserves the call-time this", async () => {
        const context = { prefix: "hello" };
        const target = function (this: typeof context, a: string, b: string) {
            return this.prefix + " " + a + " " + b;
        };

        const bound = Q.fbind(target, "world");
        const result = await bound.call(context, "!");

        expect(result).toBe("hello world !");
    });
});