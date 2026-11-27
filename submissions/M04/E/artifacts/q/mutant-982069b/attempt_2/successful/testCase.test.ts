const Q: any = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q long stack traces", () => {
    it("preserves stack trace details across a promise rejection when long stack support is enabled", async () => {
        Q.longStackSupport = true;

        const deferred = Q.defer();
        const originalError = new Error("stack trace probe");

        const observed: any = await new Promise((resolve) => {
            deferred.promise.catch((reason: any) => {
                resolve(reason);
            });
            deferred.reject(originalError);
        });

        expect(observed).toBe(originalError);
        expect(typeof observed.stack).toBe("string");
        expect(observed.stack).toContain("stack trace probe");
        expect(observed.stack).toContain("From previous event:");
    });
});