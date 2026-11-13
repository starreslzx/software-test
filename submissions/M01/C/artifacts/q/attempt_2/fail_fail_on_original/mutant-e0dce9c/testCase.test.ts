import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q promise valueOf on rejected promise", () => {
    it("throws the rejection reason when valueOf is called on a rejected promise", () => {
        const reason = new Error("rejected reason");
        const rejected = Q.reject(reason);

        expect(rejected.inspect().state).toBe("rejected");
        expect(() => rejected.valueOf()).toThrow(reason);
    });
});