import * as path from "path";

describe("Q nextTick with setImmediate", () => {
    it("should use setImmediate for scheduling when setImmediate is available and process.nextTick is not", (done) => {
        const originalSetImmediate = (global as any).setImmediate;
        const originalMessageChannel = (global as any).MessageChannel;
        const originalNextTick = process.nextTick;

        let setImmediateUsed = false;

        // Replace setImmediate with a marker that records usage.
        Object.defineProperty(global, "setImmediate", {
            configurable: true,
            writable: true,
            value: function (fn: any) {
                setImmediateUsed = true;
                return setTimeout(typeof fn === "function" ? fn : function () {}, 0);
            }
        });

        // Provide a working MessageChannel so the mutated code path
        // (which skips the empty setImmediate branch and falls through to
        // the MessageChannel branch) can still function.
        if (typeof originalMessageChannel === "undefined") {
            Object.defineProperty(global, "MessageChannel", {
                configurable: true,
                writable: true,
                value: function (this: any) {
                    const self = this;
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
                }
            });
        }

        // Remove process.nextTick so the setImmediate branch is selected.
        Object.defineProperty(process, "nextTick", {
            configurable: true,
            writable: true,
            value: undefined
        });

        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        delete require.cache[require.resolve(qPath)];

        let Q: any;
        try {
            Q = require(qPath);
        } finally {
            Object.defineProperty(global, "setImmediate", {
                configurable: true,
                writable: true,
                value: originalSetImmediate
            });
            Object.defineProperty(process, "nextTick", {
                configurable: true,
                writable: true,
                value: originalNextTick
            });
            if (originalMessageChannel !== undefined) {
                Object.defineProperty(global, "MessageChannel", {
                    configurable: true,
                    writable: true,
                    value: originalMessageChannel
                });
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
                expect(setImmediateUsed).toBe(true);
                expect(called).toBe(true);
                done();
            } catch (e) {
                done(e);
            }
        }, 50);
    });
});