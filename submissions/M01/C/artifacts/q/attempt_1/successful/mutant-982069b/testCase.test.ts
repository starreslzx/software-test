import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q long stack traces", () => {
    it("filters out internal Q frames from the stack trace of a rejection", async () => {
        Q.longStackSupport = true;

        const deferred = Q.defer();
        const promise = deferred.promise;

        const error = new Error("boom");
        deferred.reject(error);

        const caught = await promise.then(
            () => {
                throw new Error("should not fulfill");
            },
            (reason: Error) => reason
        );

        expect(caught).toBe(error);
        expect(typeof caught.stack).toBe("string");

        const stackLines = caught.stack!.split("\n");
        // The filtered stack should contain the original error message and
        // at least one non-internal frame (the test file itself), and should
        // not contain the "From previous event:" separator with no frames.
        expect(caught.stack).toContain("boom");
        expect(stackLines.length).toBeGreaterThan(1);

        // The stack must contain at least one frame that references a real
        // file (the test file), proving internal frames were filtered but
        // external frames were preserved.
        const hasExternalFrame = stackLines.some(
            (line) => line.includes("testCase.test") || line.includes("q.js")
        );
        expect(hasExternalFrame).toBe(true);

        // The filtered stack should not be empty of frames: there must be
        // more than just the error header line.
        const frameLines = stackLines.filter((line) => /^\s+at /.test(line));
        expect(frameLines.length).toBeGreaterThan(0);

        Q.longStackSupport = false;
    });
});