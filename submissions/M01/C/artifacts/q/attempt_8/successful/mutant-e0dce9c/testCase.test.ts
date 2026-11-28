import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q promise valueOf on fulfilled promise", () => {
    it("returns the fulfillment value when valueOf is called on a fulfilled promise", () => {
        const fulfilled = Q.fulfill(42);

        expect(fulfilled.inspect().state).toBe("fulfilled");
        expect(fulfilled.valueOf()).toBe(42);
    });
});