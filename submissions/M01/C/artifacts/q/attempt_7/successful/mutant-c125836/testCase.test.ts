describe("Q.all fallback reduce shim", () => {
    it("waits for a pending first promise even when Array.prototype.reduce is unavailable", async () => {
        const originalReduce = Array.prototype.reduce;
        // @ts-ignore
        delete Array.prototype.reduce;
        let Q: any;
        try {
            Q = require("../../../../../../../../../../../subject_repositories/q/q.js");
        } finally {
            Array.prototype.reduce = originalReduce;
        }

        const deferred = Q.defer();
        const allPromise = Q.all([deferred.promise, Q(2)]);
        deferred.resolve(1);
        const result = await allPromise;
        expect(result).toEqual([1, 2]);
    });
});