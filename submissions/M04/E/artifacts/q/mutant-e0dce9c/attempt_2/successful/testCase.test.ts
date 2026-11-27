import * as fs from "fs";
import * as path from "path";

function loadQ(): any {
    let dir = __dirname;
    for (;;) {
        const candidate = path.join(dir, "subject_repositories", "q", "q.js");
        if (fs.existsSync(candidate)) {
            return require(candidate);
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
            break;
        }
        dir = parent;
    }
    throw new Error("Unable to locate q.js");
}

const Q = loadQ();

describe("Q promise valueOf", () => {
    it("returns the fulfillment value for a fulfilled promise", () => {
        const promise = Q(42);
        expect(promise.valueOf()).toBe(42);
    });
});