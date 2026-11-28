import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.fbind", () => {
    it("returns a bound function that applies the original function with the bound arguments", async () => {
        const add = (a: number, b: number) => a + b;
        const addFive = Q.fbind(add, 5);

        const result = await addFive(3);

        expect(result).toBe(8);
    });
});