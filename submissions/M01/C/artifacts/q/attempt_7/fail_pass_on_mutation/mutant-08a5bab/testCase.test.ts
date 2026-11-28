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

        // The original code filters out internal Q frames from the stack trace.
        // The mutated code (which always returns true from isInternalFrame)
        // will also filter out the user's frame from the test file, leaving
        // no useful frames.
        const lines = stack.split("\n");
        const hasUserFrame = lines.some((line) => line.indexOf("testCase.test.ts") !== -1);
        const hasQFrame = lines.some((line) => line.indexOf(qFile) !== -1);

        // The user's frame must be present (original keeps it).
        expect(hasUserFrame).toBe(true);
        // Internal Q frames must be filtered out (original removes them).
        expect(hasQFrame).toBe(false);
    });
});