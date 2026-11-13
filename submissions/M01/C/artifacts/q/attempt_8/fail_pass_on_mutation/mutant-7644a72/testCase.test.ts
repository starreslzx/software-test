import * as path from "path";

describe("Q return value handling", () => {
    it("should expose QReturnValue so Q.return throws a recognizable stop-iteration value", () => {
        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Q = require(qPath);

        // In the original code, QReturnValue is defined (global ReturnValue is
        // undefined), so Q.return throws an instance of QReturnValue whose
        // toString is "[object StopIteration]" via the QReturnValue branch of
        // isStopIteration. In the mutated code, QReturnValue is never assigned,
        // so Q.return throws a TypeError instead.
        let thrown: any;
        try {
            Q["return"](7);
        } catch (e) {
            thrown = e;
        }

        expect(thrown).toBeDefined();
        expect(thrown instanceof TypeError).toBe(false);
        expect(thrown.value).toBe(7);
        expect(Object.prototype.toString.call(thrown)).toBe("[object Object]");
        expect(thrown.constructor.name).toBe("QReturnValue");
    });
});