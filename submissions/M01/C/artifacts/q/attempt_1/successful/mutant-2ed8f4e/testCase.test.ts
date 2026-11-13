import * as path from "path";
import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q long stack traces filtering", () => {
    it("filters out Q internal frames from rejection stack traces", async () => {
        Q.longStackSupport = true;
        try {
            const error = await Q.reject(new Error("boom")).then(() => {
                throw new Error("unreachable");
            }).catch((e: Error) => {
                throw e;
            }).then(
                () => {
                    throw new Error("unreachable");
                },
                (e: Error) => e
            );

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("boom");
            expect(typeof error.stack).toBe("string");

            const stack = error.stack as string;
            const qFileName = path.basename(__filename);

            // The original implementation filters out internal Q frames and
            // joins the remaining lines. The mutated implementation returns
            // undefined (empty function), so the stack would not be a proper
            // filtered string containing the original error message line.
            expect(stack).toContain("Error: boom");

            // The stack should contain a "From previous event:" separator
            // because the error was created in one turn and observed in a
            // later turn with long stack support enabled.
            expect(stack).toContain("From previous event:");

            // The filtered stack should not contain the raw Q internal
            // implementation frames (e.g. references to q.js internals).
            const lines = stack.split("\n");
            const hasQInternalFrame = lines.some((line) =>
                line.includes("q.js") && line.includes("promiseDispatch")
            );
            expect(hasQInternalFrame).toBe(false);

            // Ensure the stack is a non-empty string, not undefined.
            expect(stack.length).toBeGreaterThan(0);
        } finally {
            Q.longStackSupport = false;
        }
    });
});