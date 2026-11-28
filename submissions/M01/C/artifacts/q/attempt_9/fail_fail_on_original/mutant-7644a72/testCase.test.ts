import * as path from "path";

describe("Q return value handling", () => {
    it("should let Q.async resolve with Q.return value in ES6 generators", async () => {
        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Q = require(qPath);

        // In the original code, QReturnValue is defined (global ReturnValue is
        // undefined), so Q.return throws an instance recognized by
        // isStopIteration, and Q.async resolves the promise with the return
        // value. In the mutated code, QReturnValue is never assigned, so
        // Q.return throws a TypeError, which Q.async turns into a rejection.
        let resolvedValue: any;
        let rejectedReason: any;
        try {
            resolvedValue = await Q.async(function* (): any {
                const a = yield Q(1);
                const b = yield Q(2);
                Q["return"](a + b);
                return -1;
            })();
        } catch (e) {
            rejectedReason = e;
        }

        expect(rejectedReason).toBeUndefined();
        expect(resolvedValue).toBe(3);
    });
});