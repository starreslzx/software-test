import * as path from "path";

describe("Q return value handling", () => {
    it("should support Q.return to stop an async generator with a value", async () => {
        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Q = require(qPath);

        // In the original code, QReturnValue is defined and Q.return throws an
        // instance of it, which Q.async recognizes via isStopIteration and
        // converts into a fulfilled promise with the return value. In the
        // mutated code, QReturnValue is undefined, so Q.return throws a
        // TypeError, which Q.async treats as a rejection.
        const result = await Q.async(function* (): any {
            const a = yield Q(1);
            const b = yield Q(2);
            Q["return"](a + b);
            return -1;
        })();

        expect(result).toBe(3);
    });
});