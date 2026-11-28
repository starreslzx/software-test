import * as path from "path";

describe("Q return value handling", () => {
    it("should expose a QReturnValue constructor so Q.return throws a StopIteration-like value", () => {
        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Q = require(qPath);

        // In the original code, QReturnValue is defined (global ReturnValue is
        // undefined), so Q.return throws an instance of QReturnValue with a
        // `value` property. In the mutated code, QReturnValue is never
        // assigned, so Q.return throws a TypeError ("QReturnValue is not a
        // constructor") instead.
        let thrown: any;
        try {
            Q["return"](99);
        } catch (e) {
            thrown = e;
        }

        expect(thrown).toBeDefined();
        expect(thrown instanceof TypeError).toBe(false);
        expect(thrown.value).toBe(99);
    });
});