// @ts-nocheck
const fs = require("fs");
const path = require("path");

function evaluateModule(file: string) {
    const source = fs.readFileSync(file, "utf8");
    const moduleObject = { exports: {} };
    const factory = new Function(
        "module",
        "exports",
        "require",
        "process",
        "setTimeout",
        "clearTimeout",
        "setImmediate",
        "MessageChannel",
        "window",
        "self",
        "global",
        source
    );
    factory(
        moduleObject,
        moduleObject.exports,
        require,
        process,
        setTimeout,
        clearTimeout,
        typeof setImmediate === "function" ? setImmediate : undefined,
        typeof MessageChannel !== "undefined" ? MessageChannel : undefined,
        undefined,
        undefined,
        globalThis
    );
    return moduleObject.exports;
}

function loadQ() {
    const candidatePaths = [
        path.join("subject_repositories", "q", "q.js"),
        path.join("subject_repositories", "q.js"),
        path.join("q", "q.js"),
        "q.js"
    ];

    let directory = __dirname;
    while (true) {
        for (const candidate of candidatePaths) {
            const absolutePath = path.join(directory, candidate);
            if (!fs.existsSync(absolutePath)) {
                continue;
            }
            let relativePath = path
                .relative(__dirname, absolutePath)
                .split(path.sep)
                .join("/");
            if (relativePath.charAt(0) !== ".") {
                relativePath = "./" + relativePath;
            }
            try {
                return require(relativePath);
            } catch (error) {
                // fall through
            }
            try {
                return require(absolutePath);
            } catch (error) {
                // fall through to in-process evaluation
            }
            return evaluateModule(absolutePath);
        }
        const parent = path.dirname(directory);
        if (parent === directory) {
            break;
        }
        directory = parent;
    }
    throw new Error("Unable to locate the Q library for the test");
}

const Q = loadQ();

describe("Q long stack traces", () => {
    it("drops Node.js internal frames when improving rejection stacks", () => {
        Q.longStackSupport = true;

        const deferred = Q.defer();
        const error = new Error("boom");
        error.stack = [
            "Error: boom",
            "    at userCode (/app/app.js:12:34)",
            "    at nodeInternal (node.js:99:1)"
        ].join("\n");

        deferred.reject(error);

        return deferred.promise.then(
            () => {
                throw new Error("The promise should have been rejected");
            },
            (reason: any) => {
                expect(typeof reason.stack).toBe("string");
                expect(reason.stack).toContain("/app/app.js:12:34");
                expect(reason.stack).not.toContain("(node.js:99:1)");
            }
        );
    });
});