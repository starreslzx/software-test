import { describe, it, expect } from "@jest/globals";
import * as path from "path";

describe("Q nextTick uncaught exception in non-Node environment", () => {
    it("rethrows task errors asynchronously in a browser-like environment", (done) => {
        // Simulate a browser-like environment so Q uses the non-Node branch
        // where uncaught task exceptions are re-thrown asynchronously.
        const originalProcess = (global as any).process;
        const originalSetTimeout = (global as any).setTimeout;

        const scheduled: Array<() => void> = [];
        const fakeSetTimeout = (fn: () => void) => {
            scheduled.push(fn);
            return 0 as any;
        };

        // Fake a browser-ish process object that fails the Node check
        // (process.toString() !== "[object process]").
        const fakeProcess = {
            toString: () => "[object Object]",
        };

        (global as any).process = fakeProcess;
        (global as any).setTimeout = fakeSetTimeout;

        try {
            // Load Q fresh so it picks up the fake environment.
            const qPath = path.resolve(
                __dirname,
                "../../../../../../../../../../../subject_repositories/q/q.js"
            );
            delete require.cache[require.resolve(qPath)];
            const Q = require(qPath);

            let thrown: any = null;
            Q.nextTick(function () {
                throw new Error("boom");
            });

            // Flush the scheduled task; the error should be re-thrown
            // asynchronously via setTimeout in the original code.
            expect(scheduled.length).toBeGreaterThan(0);
            const flushTask = scheduled.shift()!;
            flushTask();

            // After flushing, the original schedules another setTimeout
            // that re-throws the error. The mutated code schedules an
            // empty function instead.
            expect(scheduled.length).toBeGreaterThan(0);
            const rethrowTask = scheduled.shift()!;

            try {
                rethrowTask();
            } catch (e) {
                thrown = e;
            }

            expect(thrown).toBeInstanceOf(Error);
            expect(thrown.message).toBe("boom");

            // Restore environment before finishing.
            (global as any).process = originalProcess;
            (global as any).setTimeout = originalSetTimeout;
            done();
        } catch (err) {
            (global as any).process = originalProcess;
            (global as any).setTimeout = originalSetTimeout;
            done(err as Error);
        }
    });
});