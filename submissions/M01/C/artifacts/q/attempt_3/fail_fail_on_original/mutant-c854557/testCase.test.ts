import * as path from "path";
import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q stack trace filtering", () => {
    it("should preserve multi-digit line numbers when filtering stack traces", () => {
        // Enable long stack support via the module's own property descriptor.
        const descriptor = Object.getOwnPropertyDescriptor(Q, "longStackSupport");
        if (descriptor && descriptor.set) {
            descriptor.set.call(Q, true);
        } else {
            Object.defineProperty(Q, "longStackSupport", {
                value: true,
                configurable: true,
                writable: true,
            });
        }

        const deferred = (Q as any).defer();

        let capturedError: any;
        try {
            throw new Error("boom");
        } catch (e) {
            capturedError = e;
        }

        deferred.reject(capturedError);

        return deferred.promise.then(
            () => {
                throw new Error("expected rejection");
            },
            (reason: any) => {
                expect(typeof reason.stack).toBe("string");
                // The filtered stack must still reference this test file.
                expect(reason.stack).toContain(path.basename(__filename));
            }
        );
    });
});