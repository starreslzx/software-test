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

        // Create a deferred and reject it, then attach a rejection handler
        // from within the test file. The stack trace of the rejection reason
        // should be filtered to remove internal Q frames.
        const deferred = q.defer();
        const promise = deferred.promise;

        const error: Error = await new Promise((resolve) => {
            promise.then(
                () => {
                    // never reached
                },
                (reason: Error) => resolve(reason)
            );
            deferred.reject(new Error("boom"));
        });

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("boom");

        const stack = error.stack || "";
        const qFile = path.basename(
            require.resolve("../../../../../../../../../../../subject_repositories/q/q.js")
        );

        // The original filters out internal Q frames, so no line should
        // reference q.js. The mutated code (isInternalFrame always true)
        // filters out ALL frames, so the stack should be empty of frames.
        const lines = stack.split("\n");
        const qFrameLines = lines.filter((line) => line.indexOf(qFile) !== -1);

        // Original: q.js internal frames are removed.
        expect(qFrameLines.length).toBe(0);

        // Original: the user's frame (this test file) is preserved.
        // Mutated: isInternalFrame returns true for everything, so the user
        // frame is also removed.
        const userFrameLines = lines.filter(
            (line) => line.indexOf("testCase.test.ts") !== -1
        );
        expect(userFrameLines.length).toBeGreaterThan(0);
    });
});