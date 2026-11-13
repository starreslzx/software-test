import * as path from "path";

describe("Q return value handling", () => {
    it("should support Q.return to stop an async generator with a value", async () => {
        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Q = require(qPath);

        // In the original code, QReturnValue is defined (since global ReturnValue
        // is undefined) and Q.return throws an instance of it. In the mutated
        // code, the QReturnValue constructor is left undefined, so Q.return
        // throws a TypeError instead. We observe the difference by catching the
        // thrown value and checking its shape.
        let thrown: any;
        try {
            Q["return"](42);
        } catch (e) {
            thrown = e;
        }

        expect(thrown).toBeDefined();
        expect(thrown.value).toBe(42);
        expect(thrown instanceof TypeError).toBe(false);
    });
});