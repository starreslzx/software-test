import Q = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q long stack traces", () => {
    it("augments a rejection stack with the origin promise stack when long stack support is enabled", async () => {
        Q.longStackSupport = true;
        try {
            const deferred = Q.defer();
            const error = new Error("boom");
            deferred.reject(error);

            const observed = await deferred.promise.then(null, (reason: Error) => reason);

            expect(observed).toBe(error);
            expect(observed.stack).toContain("Error: boom");
            expect(observed.stack).toContain("From previous event:");
        } finally {
            Q.longStackSupport = false;
        }
    });
});