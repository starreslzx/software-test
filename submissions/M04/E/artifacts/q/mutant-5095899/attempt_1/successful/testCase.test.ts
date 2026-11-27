import * as fs from "fs";
import * as path from "path";
import * as vm from "vm";

function findQSourcePath(startDir: string): string {
  let dir = startDir;
  for (let i = 0; i < 20; i++) {
    const candidate = path.join(dir, "subject_repositories", "q", "q.js");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error("Unable to locate subject_repositories/q/q.js");
}

describe("Q global script environment detection", () => {
  it("exposes Q on self when only self is present (no window, no CommonJS)", () => {
    const source = fs.readFileSync(findQSourcePath(__dirname), "utf8");
    const selfObject: any = {};
    const sandbox: any = {
      self: selfObject,
      setTimeout,
      clearTimeout,
    };
    const context = vm.createContext(sandbox);

    expect(() => vm.runInContext(source, context)).not.toThrow();
    expect(typeof selfObject.Q).toBe("function");
    expect(typeof selfObject.Q.noConflict).toBe("function");
  });
});