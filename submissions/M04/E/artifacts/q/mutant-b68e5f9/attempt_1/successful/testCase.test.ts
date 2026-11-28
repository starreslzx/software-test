function loadQ(): any {
    const candidatePaths = [
        "../../../../../../../../../../subject_repositories/q/q.js",
        "../../../../../../../../../../../../subject_repositories/q/q.js",
    ];
    for (const candidate of candidatePaths) {
        try {
            return require(candidate);
        } catch (error) {
            // Try the next possible location.
        }
    }
    throw new Error("Could not locate q.js");
}

const Q = loadQ();

describe("Q.nodeify", () => {
    it("returns the original promise when no nodeback is supplied", () => {
        const deferred = Q.defer();
        const promise = deferred.promise;

        const viaStatic = Q.nodeify(promise);
        expect(viaStatic).toBe(promise);

        const viaMethod = promise.nodeify();
        expect(viaMethod).toBe(promise);
    });
});