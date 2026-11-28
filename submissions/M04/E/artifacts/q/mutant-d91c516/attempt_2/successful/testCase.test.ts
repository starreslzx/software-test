import * as fs from "fs";
import * as path from "path";

function isFile(candidate: string): boolean {
    try {
        return fs.statSync(candidate).isFile();
    } catch (e) {
        return false;
    }
}

function findQFile(startDir: string): string | undefined {
    let dir = startDir;
    for (;;) {
        const repoDir = path.join(dir, "subject_repositories");
        const candidates = [
            path.join(repoDir, "q", "q.js"),
            path.join(repoDir, "q.js", "q.js"),
            path.join(repoDir, "q.js"),
        ];
        for (const candidate of candidates) {
            if (isFile(candidate)) {
                return candidate;
            }
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
            return undefined;
        }
        dir = parent;
    }
}

const qFile = findQFile(__dirname);
if (!qFile) {
    throw new Error("Unable to locate subject_repositories/q/q.js");
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Q = require(qFile);

describe("Q.keys", () => {
    it("fulfills with the enumerable keys of a plain object", async () => {
        const keys = await Q.keys({ alpha: 1, beta: 2 });
        expect(keys.sort()).toEqual(["alpha", "beta"]);
    });
});