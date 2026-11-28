import * as path from "path";

describe("Q nextTick with setImmediate", () => {
    it("should flush nextTick tasks when setImmediate is available and MessageChannel is not", (done) => {
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

        // In the original code, requestTick is set via setImmediate (the
        // setImmediate branch). In the mutated code, the setImmediate branch
        // is empty ({}) so requestTick remains undefined, and calling nextTick
        // will throw a TypeError when it tries to invoke requestTick().
        let threw: any = null;
        let called = false;
        try {
            Q.nextTick(function () {
                called = true;
            });
        } catch (e) {
            threw = e;
        }

        setTimeout(function () {
            try {
                // Original: no synchronous throw, task eventually runs.
                expect(threw).toBeNull();
                expect(called).toBe(true);
                done();
            } catch (e) {
                done(e);
            }
        }, 50);
    });
});