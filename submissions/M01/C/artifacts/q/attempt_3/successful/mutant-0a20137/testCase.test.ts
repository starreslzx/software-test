import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.join", () => {
    it("returns a promise fulfilled with the shared value when both arguments are equal", async () => {
        const value = { id: 42 };
        const result = await Q.join(value, value);
        expect(result).toBe(value);
    });
});