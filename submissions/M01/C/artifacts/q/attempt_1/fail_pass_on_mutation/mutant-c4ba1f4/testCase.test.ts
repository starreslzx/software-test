import * as path from "path";

describe("Q nextTick with setImmediate", () => {
    it("should execute tasks scheduled via nextTick when setImmediate is available", (done) => {
        const originalSetImmediate = (global as any).setImmediate;
        const originalMessageChannel = (global as any).MessageChannel;

        // Ensure setImmediate is available and MessageChannel is not, so the
        // setImmediate branch is taken in the original code.
        (global as any).setImmediate = (fn: () => void) => {
            return setTimeout(fn, 0);
        };
        delete (global as any).MessageChannel;

        // Clear module cache so q.js re-evaluates its nextTick setup.
        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        delete require.cache[require.resolve(qPath)];

        let Q: any;
        try {
            Q = require(qPath);
        } finally {
            // Restore globals immediately after loading.
            (global as any).setImmediate = originalSetImmediate;
            if (originalMessageChannel !== undefined) {
                (global as any).MessageChannel = originalMessageChannel;
            }
        }

        let called = false;
        Q.nextTick(function () {
            called = true;
        });

        setTimeout(function () {
            try {
                expect(called).toBe(true);
                done();
            } catch (e) {
                done(e);
            }
        }, 50);
    });
});