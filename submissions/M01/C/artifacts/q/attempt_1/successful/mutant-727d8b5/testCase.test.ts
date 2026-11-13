import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.any progress notifications", () => {
    it("forwards progress notifications from input promises with index and value", (done) => {
        const deferred1 = Q.defer();
        const deferred2 = Q.defer();

        const progressEvents: Array<{ index: number; value: any }> = [];

        Q.any([deferred1.promise, deferred2.promise]).then(
            () => {
                // Should not be reached in this test
                done(new Error("Expected no fulfillment"));
            },
            () => {
                done(new Error("Expected no rejection"));
            },
            (progress: { index: number; value: any }) => {
                progressEvents.push(progress);
            }
        );

        // Emit progress notifications from the input promises.
        deferred1.notify("first-progress");
        deferred2.notify("second-progress");

        // Give the event loop time to deliver progress notifications.
        setTimeout(() => {
            try {
                expect(progressEvents).toEqual([
                    { index: 0, value: "first-progress" },
                    { index: 1, value: "second-progress" }
                ]);
                done();
            } catch (error) {
                done(error as Error);
            }
        }, 50);
    });
});