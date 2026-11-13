import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.all with pending promises", () => {
    it("resolves only after all pending promises are fulfilled", async () => {
        const d1 = Q.defer();
        const d2 = Q.defer();

        const allPromise = Q.all([d1.promise, d2.promise]);

        let resolved = false;
        allPromise.then(function () {
            resolved = true;
        });

        d1.resolve("a");

        // Allow microtasks/ticks to flush so the first fulfillment is processed.
        await new Promise(function (resolve) { setTimeout(resolve, 20); });

        // The all() promise must not be resolved yet because d2 is still pending.
        expect(resolved).toBe(false);

        d2.resolve("b");

        const result = await allPromise;
        expect(result).toEqual(["a", "b"]);
    });
});