import * as path from "path";

describe("Q long stack traces", () => {
    it("filters out internal Node.js frames from error stack traces", async () => {
        const Q = require("../../../../../../../../../../../subject_repositories/q/q.js");

        Q.longStackSupport = true;

        const deferred = Q.defer();
        const error = new Error("boom");

        const promise = deferred.promise.then(function () {
            throw error;
        });

        deferred.resolve();

        const reason = await promise.then(
            function () {
                return null;
            },
            function (err: any) {
                return err;
            }
        );

        expect(reason).toBe(error);
        expect(typeof reason.stack).toBe("string");

        const lines: string[] = reason.stack.split("\n");
        const internalNodeFrames = lines.filter(function (line) {
            return line.indexOf("(node.js:") !== -1;
        });

        expect(internalNodeFrames).toHaveLength(0);
    });
});