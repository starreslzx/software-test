import * as path from "path";

describe("Q nextTick with setImmediate", () => {
    it("should schedule flush via setImmediate when setImmediate is available and MessageChannel is not", (done) => {
        const originalSetImmediate = (global as any).setImmediate;
        const originalMessageChannel = (global as any).MessageChannel;

        // Provide setImmediate, remove MessageChannel so the setImmediate
        // branch is the one selected by the original code.
        (global as any).setImmediate = function (fn: () => void) {
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
                expect(called).toBe(true);
                done();
            } catch (e) {
                done(e);
            }
        }, 50);
    });
});