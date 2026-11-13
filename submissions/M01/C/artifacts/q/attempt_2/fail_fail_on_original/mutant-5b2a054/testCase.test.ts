import * as path from "path";

describe("Q nextTick uncaught exception in non-Node environment", () => {
    it("rethrows task errors asynchronously in a browser-like environment", (done) => {
        const originalProcess = (global as any).process;
        const originalSetTimeout = (global as any).setTimeout;

        const scheduled: Array<() => void> = [];
        const fakeSetTimeout = (fn: () => void) => {
            scheduled.push(fn);
            return 0 as any;
        };

        const fakeProcess = {
            toString: () => "[object Object]",
        };

        (global as any).process = fakeProcess;
        (global as any).setTimeout = fakeSetTimeout;

        try {
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

            expect(scheduled.length).toBeGreaterThan(0);
            const flushTask = scheduled.shift()!;
            flushTask();

            expect(scheduled.length).toBeGreaterThan(0);
            const rethrowTask = scheduled.shift()!;

            try {
                rethrowTask();
            } catch (e) {
                thrown = e;
            }

            expect(thrown).toBeInstanceOf(Error);
            expect(thrown.message).toBe("boom");

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