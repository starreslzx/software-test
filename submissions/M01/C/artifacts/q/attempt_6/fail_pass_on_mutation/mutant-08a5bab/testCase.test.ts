import * as path from "path";
import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q stack trace filtering", () => {
    it("should filter out internal Q frames from long stack traces", async () => {
        const q = Q as any;

        // Enable long stack support. Q reads Q_DEBUG at load time, but we can
        // also set the flag directly if writable.
        try {
            q.longStackSupport = true;
        } catch (e) {
            // ignore
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

        // Count how many lines in the stack reference q.js itself. The original
        // code filters out internal Q frames; the mutated code does not.
        const qFrameCount = stack
            .split("\n")
            .filter((line) => line.indexOf(qFile) !== -1).length;

        // The stack should contain the user frame (the test file).
        expect(stack).toContain("testCase.test.ts");
        // The original filters out internal q.js frames entirely.
        expect(qFrameCount).toBe(0);
    });
});