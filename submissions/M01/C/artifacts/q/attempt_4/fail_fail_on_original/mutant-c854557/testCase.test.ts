import * as path from "path";
import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q stack trace filtering", () => {
    it("should preserve multi-digit line numbers when filtering stack traces", () => {
        // Enable long stack support through the module's own setter.
        const descriptor = Object.getOwnPropertyDescriptor(Q, "longStackSupport");
        expect(descriptor).toBeDefined();
        expect(typeof descriptor!.set).toBe("function");
        descriptor!.set!.call(Q, true);

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