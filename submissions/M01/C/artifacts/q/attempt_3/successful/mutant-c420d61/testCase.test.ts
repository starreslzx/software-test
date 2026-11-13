import * as path from "path";

describe("Q long stack traces", () => {
    it("filters out (node.js:) internal frames from error stack traces", async () => {
        const Q = require("../../../../../../../../../../../subject_repositories/q/q.js");

        Q.longStackSupport = true;

        const deferred = Q.defer();
        const error: any = new Error("boom");
        // Inject a synthetic (node.js:) frame into the error's stack.
        // The original isNodeFrame() treats this as an internal Node frame
        // and filterStackString() removes it. The mutated version returns
        // false for the (node.js:) branch, so the line survives filtering.
        error.stack =
            "Error: boom\n" +
            "    at someUserFunction (/app/user.js:10:5)\n" +
            "    at process._tickCallback (node.js:442:13)";

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
        const nodeJsFrames = lines.filter(function (line) {
            return line.indexOf("(node.js:") !== -1;
        });

        // Original code filters out (node.js:) frames; mutated code leaves them in.
        expect(nodeJsFrames).toHaveLength(0);
    });
});