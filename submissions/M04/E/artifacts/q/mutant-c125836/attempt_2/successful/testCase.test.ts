import * as fs from "fs";
import * as path from "path";

describe("Q.all when the native Array.prototype.reduce is unavailable", () => {
  it("resolves every element in the input array, including the first one", async () => {
    function loadQ(specifier: string): any {
      const savedReduce = (Array.prototype as any).reduce;
      try {
        delete (Array.prototype as any).reduce;
        return require(specifier);
      } finally {
        (Array.prototype as any).reduce = savedReduce;
      }
    }

    function locateQFile(): string {
      let dir = __dirname;
      for (;;) {
        const candidate = path.join(dir, "subject_repositories", "q", "q.js");
        if (fs.existsSync(candidate)) {
          return candidate;
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
          throw new Error("Could not find subject_repositories/q/q.js");
        }
        dir = parent;
      }
    }

    let Q: any;
    try {
      Q = loadQ("../../../../../../../../../../../../subject_repositories/q/q.js");
    } catch {
      Q = loadQ(locateQFile());
    }

    const values = await Q.all([Q(1), Q(2), Q(3)]);

    expect(values[0]).toBe(1);
    expect(values[1]).toBe(2);
    expect(values[2]).toBe(3);
  });
});