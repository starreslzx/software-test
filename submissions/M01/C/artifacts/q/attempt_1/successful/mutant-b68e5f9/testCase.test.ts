import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.nodeify", () => {
    it("returns the promise when no nodeback is provided", () => {
        const promise = Q(42);
        const result = promise.nodeify();
        expect(result).toBe(promise);
    });
});