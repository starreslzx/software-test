import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.all with pending promises", () => {
    it("resolves with the fulfillment values of pending promises", async () => {
        const d1 = Q.defer();
        const d2 = Q.defer();

        const allPromise = Q.all([d1.promise, d2.promise]);

        d1.resolve("a");
        d2.resolve("b");

        const result = await allPromise;
        expect(result).toEqual(["a", "b"]);
    });
});