import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.all with a pre-fulfilled promise array", () => {
    it("resolves with the original values when all entries are already fulfilled", async () => {
        const result = await Q.all([Q(1), Q(2), Q(3)]);
        expect(result).toEqual([1, 2, 3]);
    });
});