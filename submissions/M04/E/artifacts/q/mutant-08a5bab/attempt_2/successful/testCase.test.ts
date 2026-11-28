// @ts-ignore
const Q: any = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q long stack trace filtering", () => {
    it("keeps frames from foreign files that share line numbers with Q's own source", () => {
        Q.longStackSupport = true;

        const error = new Error("boom");
        error.stack = "Error: boom\n    at fakeFunction (/outside/other-file.js:300:10)";

        const deferred = Q.defer();
        deferred.reject(error);

        return deferred.promise.then(
            () => {
                throw new Error("expected the promise to be rejected");
            },
            (reason: any) => {
                expect(typeof reason.stack).toBe("string");
                expect(reason.stack).toContain("/outside/other-file.js:300:10");
            }
        );
    });
});