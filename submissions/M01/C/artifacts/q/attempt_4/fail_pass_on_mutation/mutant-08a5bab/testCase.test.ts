import * as path from "path";
import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q stack trace filtering", () => {
    it("should filter out internal Q frames from long stack traces", async () => {
        const q = Q as any;

        // Enable long stack support by setting the environment variable
        // Q reads at module load time. Since the module is already loaded,
        // we instead directly set the internal flag via the exported property
        // if writable, otherwise rely on Q_DEBUG having been set.
        try {
            q.longStackSupport = true;
        } catch (e) {
            // Property is read-only; Q_DEBUG must be set externally.
        }

        const error: Error = await new Promise((resolve) => {
            q.reject(new Error("boom"))
                .then(() => {
                    // never reached
                })
                .then(
                    () => {
                        // never reached
                    },
                    (reason: Error) => resolve(reason)
                );
        });

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("boom");

        const stack = error.stack || "";
        const qFile = path.basename(
            require.resolve("../../../../../../../../../../../subject_repositories/q/q.js")
        );

        // The stack should contain the user frame (the test file) but should not
        // contain internal frames from q.js itself.
        expect(stack).toContain("testCase.test.ts");
        expect(stack).not.toContain(qFile);
    });
});