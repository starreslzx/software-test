import * as fs from "fs";
import * as path from "path";

class ReturnValue {
    value: any;

    constructor(value: any) {
        this.value = value;
    }
}

function locateQModule(): string {
    let directory = __dirname;

    // Walk up from the test file until the Q subject module is found.
    while (true) {
        const candidate = path.join(directory, "subject_repositories", "q", "q.js");
        if (fs.existsSync(candidate)) {
            return candidate;
        }

        const parent = path.dirname(directory);
        if (parent === directory) {
            throw new Error("Could not locate subject_repositories/q/q.js");
        }
        directory = parent;
    }
}

// Q inspects the global ReturnValue constructor when it loads, emulating
// SpiderMonkey's generator return-value support.
(global as any).ReturnValue = ReturnValue;

const qModulePath = path.relative(__dirname, locateQModule());
const Q = require(qModulePath);

describe("Q.return with a global ReturnValue constructor", () => {
    it("throws an instance of the provided ReturnValue with the given value", () => {
        let error: any = null;

        try {
            Q["return"]("generator result");
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(ReturnValue);
        expect(error.value).toBe("generator result");
    });
});