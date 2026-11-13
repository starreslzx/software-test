import { readFileSync } from "fs";
import { join } from "path";
import { runInNewContext } from "vm";

describe("q.js global export branch", () => {
  it("exposes Q as a global when loaded as a script in a window-like context", () => {
    const source = readFileSync(
      join(
        __dirname,
        "../../../../../../../../../../../subject_repositories/q/q.js"
      ),
      "utf8"
    );

    // Simulate a browser-like <script> environment: no CommonJS exports,
    // no AMD define, no SES, but a `window` global is present.
    const sandbox: any = {
      window: {},
      setTimeout,
      clearTimeout,
      console,
    };
    sandbox.window.window = sandbox.window;
    sandbox.window.setTimeout = setTimeout;
    sandbox.window.clearTimeout = clearTimeout;

    let error: any = null;
    try {
      runInNewContext(source, sandbox);
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(sandbox.window.Q).toBeDefined();
    expect(typeof sandbox.window.Q).toBe("function");
    expect(typeof sandbox.window.Q.noConflict).toBe("function");
  });
});