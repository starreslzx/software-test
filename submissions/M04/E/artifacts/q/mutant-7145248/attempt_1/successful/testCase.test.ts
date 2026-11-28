import * as Q from "../../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q deferred makeNodeResolver", () => {
    test("resolves with the plain value for a two-argument node callback", () => {
        const deferred = Q.defer();
        const nodeback = deferred.makeNodeResolver();

        nodeback(null, 42);

        return deferred.promise.then((value: any) => {
            expect(value).toBe(42);
        });
    });
});