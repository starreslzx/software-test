import { readFileSync } from "fs";
import { join } from "path";
import { runInNewContext } from "vm";

describe("q.js global export branch", () => {
  it("exposes Q as a global when loaded as a script in a window-only context", () => {
    const source = readFileSync(
      join(
        __dirname,
        "../../../../../../../../../../../subject_repositories/q/q.js"
      ),
      "utf8"
    );

    // Simulate a browser-like <script> environment where only `window`
    // exists but `self` does NOT exist. In the original code the condition
    // `typeof window !== "undefined" || typeof self !== "undefined"` is
    // true, so Q is installed on the window global. In the mutated code
    // the condition `typeof window !== "undefined" || typeof self === "undefined"`
    // is also true (since self is undefined), so the window branch is taken
    // and Q is installed. To distinguish, we instead make `window` undefined
    // but `self` defined, which is the reverse scenario.
    //
    // Actually: to distinguish original vs mutated, we need a context where
    // `window` is undefined and `self` is defined. Original: condition is
    // true (self defined), so window branch taken -> but window is undefined,
    // so `global = self` and Q installed on self. Mutated: condition is
    // false (self defined -> `typeof self === "undefined"` is false), so
    // falls to final else and throws.
    const sandbox: any = {
      self: {},
      setTimeout,
      clearTimeout,
      console,
    };
    sandbox.self.self = sandbox.self;
    sandbox.self.setTimeout = setTimeout;
    sandbox.self.clearTimeout = clearTimeout;

    let error: any = null;
    try {
      runInNewContext(source, sandbox);
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(sandbox.self.Q).toBeDefined();
    expect(typeof sandbox.self.Q).toBe("function");
    expect(typeof sandbox.self.Q.noConflict).toBe("function");
  });
});