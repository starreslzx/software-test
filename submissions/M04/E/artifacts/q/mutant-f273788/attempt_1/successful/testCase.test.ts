// @ts-ignore
import Q = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q.fapply", () => {
    it("invokes the function with the supplied argument array", () => {
        const add = (a: number, b: number) => a + b;
        return Q.fapply(add, [2, 3]).then((result: number) => {
            expect(result).toBe(5);
        });
    });
});