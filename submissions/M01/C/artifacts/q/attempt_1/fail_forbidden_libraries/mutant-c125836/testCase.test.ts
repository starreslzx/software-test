import { describe, it, expect } from "@jest/globals";
import * as path from "path";
import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.all with pre-fulfilled promises", () => {
    it("resolves with the array of values when all promises are already fulfilled", async () => {
        const result = await Q.all([Q(1), Q(2), Q(3)]);
        expect(result).toEqual([1, 2, 3]);
    });
});