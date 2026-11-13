import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q unhandled rejection tracking", () => {
    it("records the stack of a rejected promise's reason", (done) => {
        Q.resetUnhandledRejections();

        const error = new Error("boom");
        Q.reject(error);

        Q.nextTick.runAfter(() => {
            const reasons = Q.getUnhandledReasons();
            expect(reasons.length).toBe(1);
            expect(reasons[0]).toContain("boom");
            expect(reasons[0]).toContain("Error");
            expect(reasons[0]).not.toContain("(no stack)");
            done();
        });
    });
});