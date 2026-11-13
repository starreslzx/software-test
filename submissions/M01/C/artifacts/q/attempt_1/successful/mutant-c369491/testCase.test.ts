import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q progress notifications", () => {
    it("delivers progress notifications to a progress listener registered via then", (done) => {
        const deferred = Q.defer();
        const progressValues: number[] = [];

        deferred.promise.then(
            () => {
                // ignore fulfillment
            },
            () => {
                // ignore rejection
            },
            (value: number) => {
                progressValues.push(value);
            }
        );

        deferred.notify(1);
        deferred.notify(2);

        Q.nextTick(() => {
            Q.nextTick(() => {
                expect(progressValues).toEqual([1, 2]);
                done();
            });
        });
    });
});