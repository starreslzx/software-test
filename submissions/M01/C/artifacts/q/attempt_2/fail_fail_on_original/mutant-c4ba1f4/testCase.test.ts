import * as path from "path";

describe("Q nextTick with setImmediate", () => {
    it("should execute tasks scheduled via nextTick when setImmediate is available and MessageChannel is not", (done) => {
        const originalSetImmediate = (global as any).setImmediate;
        const originalMessageChannel = (global as any).MessageChannel;

        // Track whether setImmediate was actually invoked by Q's nextTick.
        let setImmediateCalls = 0;

        // Provide setImmediate, remove MessageChannel so the setImmediate
        // branch is the one selected by the original code.
        (global as any).setImmediate = function (fn: () => void) {
            setImmediateCalls++;
            return setTimeout(fn, 0);
        };
        delete (global as any).MessageChannel;

        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        delete require.cache[require.resolve(qPath)];

        let Q: any;
        try {
            Q = require(qPath);
        } finally {
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
                // The original code uses setImmediate to schedule the flush,
                // so setImmediate must have been invoked at least once.
                expect(setImmediateCalls).toBeGreaterThan(0);
                expect(called).toBe(true);
                done();
            } catch (e) {
                done(e);
            }
        }, 50);
    });
});