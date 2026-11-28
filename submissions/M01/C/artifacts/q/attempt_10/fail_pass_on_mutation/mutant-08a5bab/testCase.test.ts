import * as path from "path";
import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q stack trace filtering", () => {
    it("should filter out internal Q frames from long stack traces", async () => {
        const q = Q as any;

        try {
            q.longStackSupport = true;
        } catch (e) {
            // ignore
        }

        // Build a chain where a rejection propagates through several Q
        // internal frames, then is handled by a callback defined in this
        // test file. The resulting error stack should retain the user's
        // frame but drop the internal Q frames.
        const deferred = q.defer();
        const promise = deferred.promise;

        const error: Error = await new Promise((resolve) => {
            promise
                .then(() => {
                    // never reached
                })
                .then(
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

        const lines = stack.split("\n");
        const qFrameLines = lines.filter((line) => line.indexOf(qFile) !== -1);

        // Original filters out internal Q frames.
        expect(qFrameLines.length).toBe(0);

        // Original preserves the user's frame from this test file.
        // Mutated (isInternalFrame always true) removes ALL frames, so the
        // user frame is also dropped.
        const userFrameLines = lines.filter(
            (line) => line.indexOf("testCase.test.ts") !== -1
        );
        expect(userFrameLines.length).toBeGreaterThan(0);
    });
});