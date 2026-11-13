import * as path from "path";

describe("Q nextTick with setImmediate", () => {
    it("should use setImmediate for scheduling when setImmediate is available", (done) => {
        const originalSetImmediate = (global as any).setImmediate;
        const originalMessageChannel = (global as any).MessageChannel;

        let setImmediateCalls = 0;

        // Provide a working setImmediate that records calls.
        (global as any).setImmediate = function (fn: () => void) {
            setImmediateCalls++;
            return setTimeout(fn, 0);
        };

        // Provide a working MessageChannel so the mutated code path
        // (which skips the empty setImmediate branch and falls through to
        // the MessageChannel branch) can still function.
        if (typeof originalMessageChannel === "undefined") {
            (global as any).MessageChannel = function () {
                const self: any = this;
                self.port1 = { onmessage: null };
                self.port2 = {
                    postMessage: function () {
                        setTimeout(function () {
                            if (self.port1.onmessage) {
                                self.port1.onmessage();
                            }
                        }, 0);
                    }
                };
            };
        }

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
            } else {
                delete (global as any).MessageChannel;
            }
        }

        let called = false;
        Q.nextTick(function () {
            called = true;
        });

        setTimeout(function () {
            try {
                // Original code: setImmediate branch is taken, so
                // setImmediate is invoked to schedule the flush.
                // Mutated code: setImmediate branch is empty, so the
                // MessageChannel branch is used instead and setImmediate
                // is never called.
                expect(setImmediateCalls).toBeGreaterThan(0);
                expect(called).toBe(true);
                done();
            } catch (e) {
                done(e);
            }
        }, 50);
    });
});