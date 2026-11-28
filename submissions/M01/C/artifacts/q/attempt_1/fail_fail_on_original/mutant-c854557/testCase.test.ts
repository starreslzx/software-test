import * as path from "path";
import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q stack trace filtering", () => {
    it("should include multi-digit line numbers from stack traces when filtering", () => {
        // Force long stack support so Q builds and filters stack traces.
        (Q as any).longStackSupport = true;

        const deferred = (Q as any).defer();

        let capturedError: any;
        try {
            throw new Error("boom");
        } catch (e) {
            capturedError = e;
        }

        // Reject the deferred with an error created in this test file.
        deferred.reject(capturedError);

        return deferred.promise.then(
            () => {
                throw new Error("expected rejection");
            },
            (reason: any) => {
                // The filtered stack should still contain a reference to this
                // test file with its (multi-digit) line number.
                expect(typeof reason.stack).toBe("string");
                expect(reason.stack).toContain(path.basename(__filename));
            }
        );
    });
});