import * as path from "path";

const Q = require("../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q long stack traces filtering", () => {
    it("filters internal Q frames from long stack traces while preserving user frames", (done) => {
        Q.longStackSupport = true;

        const qFilePath = require.resolve("../../../../../../../../../../../subject_repositories/q/q.js");

        function userFunctionThatRejects() {
            return Q.reject(new Error("boom"));
        }

        userFunctionThatRejects()
            .then(() => {
                done(new Error("should have rejected"));
            })
            .catch((error: any) => {
                try {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe("boom");
                    expect(typeof error.stack).toBe("string");

                    // The user's own frame should be present in the stack.
                    expect(error.stack).toContain("userFunctionThatRejects");

                    // Internal Q frames from q.js should be filtered out.
                    expect(error.stack).not.toContain(qFilePath);

                    done();
                } catch (assertionError) {
                    done(assertionError as Error);
                }
            });
    });
});