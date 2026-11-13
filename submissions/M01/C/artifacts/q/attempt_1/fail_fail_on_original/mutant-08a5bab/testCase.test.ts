import * as path from "path";
import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q stack trace filtering", () => {
    it("should filter out internal Q frames from long stack traces", async () => {
        Q.longStackSupport = true;

        const error = await Q.reject(new Error("boom"))
            .then(() => {
                // never reached
            })
            .then(
                () => {
                    // never reached
                },
                (reason: Error) => reason
            );

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("boom");

        const stack = error.stack || "";
        const qFile = path.basename(require.resolve("../../../../../../../../../../../subject_repositories/q/q.js"));

        // The stack should contain the user frame (the test file) but should not
        // contain internal frames from q.js itself.
        expect(stack).toContain("testCase.test.ts");
        expect(stack).not.toContain(qFile);

        Q.longStackSupport = false;
    });
});