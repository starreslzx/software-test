function loadQ(): any {
    for (let depth = 8; depth <= 20; depth++) {
        const modulePath = "../".repeat(depth) + "subject_repositories/q/q.js";
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require(modulePath);
        } catch (error) {
            // Keep searching parent directories until the subject module is found.
        }
    }
    throw new Error("Could not locate subject_repositories/q/q.js");
}

const Q = loadQ();

describe("Q.all", () => {
    it("waits for pending promises and resolves with their fulfillment values", async () => {
        const deferred = Q.defer();
        const allPromise = Q.all([Q(1), deferred.promise]);

        Q.nextTick(() => {
            deferred.resolve(2);
        });

        const values = await allPromise;

        expect(values).toEqual([1, 2]);
    });
});