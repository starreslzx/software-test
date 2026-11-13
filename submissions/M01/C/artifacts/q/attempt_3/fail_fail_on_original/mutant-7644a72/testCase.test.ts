import * as path from "path";

describe("Q return value handling", () => {
    it("should support Q.return to stop an async generator with a value", async () => {
        const qPath = path.resolve(
            __dirname,
            "../../../../../../../../../../../subject_repositories/q/q.js"
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Q = require(qPath);

        const result = await Q.async(function* (): any {
            const a = yield Q(1);
            const b = yield Q(2);
            Q["return"](a + b);
            // unreachable
            return -1;
        })();

        expect(result).toBe(3);
    });
});