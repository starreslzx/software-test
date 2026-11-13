/**
 * @jest-environment node
 */
import * as path from "path";

describe("Q nextTick with setImmediate", () => {
    it("should use setImmediate for scheduling when setImmediate is available and process.nextTick is not", (done) => {
        const originalSetImmediate = (global as any).setImmediate;
        const originalMessageChannel = (global as any).MessageChannel;
        const originalNextTick = process.nextTick;

        let setImmediateUsed = false;

        (global as any).setImmediate = function (fn: any) {
            setImmediateUsed = true;
            return setTimeout(typeof fn === "function" ? fn : function () {}, 0);
        };

        if (typeof originalMessageChannel === "undefined") {
            (global as any).MessageChannel = function (this: any) {
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
            };
        }

        (process as any).nextTick = undefined;

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
            (process as any).nextTick = originalNextTick;
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
                expect(setImmediateUsed).toBe(true);
                expect(called).toBe(true);
                done();
            } catch (e) {
                done(e);
            }
        }, 50);
    });
});