const fs = require("fs");
const path = require("path");

function findUp(relativePaths: string[]): string | undefined {
  let dir = __dirname;
  for (;;) {
    for (const rel of relativePaths) {
      const candidate = path.join(dir, rel);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
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

const qPath =
  findUp([path.join("subject_repositories", "q", "q.js")]) ||
  findUp([
    path.join("subject_repositories", "q.js"),
    path.join("q", "q.js"),
    "q.js",
  ]);

if (!qPath) {
  throw new Error("Could not locate the Q library (q.js)");
}

const Q = require(qPath);

describe("Q.async with ES6 generators", () => {
  it("resumes the generator with the value it yielded and resolves with the generator's return value", async () => {
    const run = Q.async(function* (): Generator<any, any, any> {
      const value = yield 41;
      if (value !== 41) {
        throw new Error("Generator was resumed with an unexpected value");
      }
      return value + 1;
    });

    await expect(run()).resolves.toBe(42);
  });
});