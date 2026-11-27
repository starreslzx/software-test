import * as QModule from "../../../../../../../../../../../../subject_repositories/q/q.js";

// q.js exports a callable CommonJS module value; resolve it in both
// interop and plain CommonJS compilation modes.
const Q: any = (QModule as any).default || QModule;

describe("Q long stack traces", () => {
    it("filters the library's own source frames out of a long stack trace", async () => {
        Q.longStackSupport = true;

        const error = await Q(1)
            .then(function () {
                return Q(1).join(2);
            })
            .then(void 0, function (reason: Error) {
                return reason;
            });

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain("Q can't join");
        expect(error.stack).not.toMatch(/q\.js:\d+:\d+/);
    });
});