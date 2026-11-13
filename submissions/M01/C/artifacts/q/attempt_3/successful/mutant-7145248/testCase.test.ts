import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("makeNodeResolver", () => {
    it("resolves with an array of values when called with more than two arguments", async () => {
        const deferred = Q.defer();
        const nodeback = deferred.makeNodeResolver();

        nodeback(null, "a", "b", "c");

        const result = await deferred.promise;
        expect(result).toEqual(["a", "b", "c"]);
    });
});