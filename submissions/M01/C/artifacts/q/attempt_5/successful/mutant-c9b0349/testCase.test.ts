const Q = require("../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q long stack trace filtering", () => {
    it("keeps user frames and drops internal q.js frames from long stack traces", (done) => {
        Q.longStackSupport = true;

        const qFilePath = require.resolve("../../../../../../../../../../../subject_repositories/q/q.js");

        const err: any = new Error("boom");
        err.stack =
            "Error: boom\n" +
            "    at userFunction (/some/user/file.js:10:5)\n" +
            "    at earlyQFrame (" + qFilePath + ":1:1)";

        let captured: any = null;
        const previousOnError = Q.onerror;
        Q.onerror = function (e: any) {
            captured = e;
        };

        const deferred = Q.defer();
        deferred.reject(err);
        deferred.promise.done();

        setTimeout(function () {
            try {
                Q.onerror = previousOnError;

                expect(captured).not.toBeNull();
                expect(typeof captured.stack).toBe("string");

                // User frames must be preserved.
                expect(captured.stack).toContain("userFunction");

                // A q.js frame at a line before qStartingLine should NOT be
                // treated as internal by the original implementation.
                expect(captured.stack).toContain("earlyQFrame");

                done();
            } catch (assertionError) {
                done(assertionError as Error);
            }
        }, 50);
    });
});