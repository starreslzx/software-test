import * as fs from "fs";
import * as path from "path";

describe("Q promise library", () => {
  it("rethrows exceptions from scheduled tasks asynchronously instead of silently discarding them", () => {
    function loadQUnderTest(): any {
      jest.resetModules();

      let directory = __dirname;
      while (true) {
        const absolute = path.join(directory, "subject_repositories", "q", "q.js");
        if (fs.existsSync(absolute)) {
          let relative = path.relative(__dirname, absolute);
          if (!relative.startsWith(".")) {
            relative = "./" + relative;
          }
          relative = relative.split(path.sep).join("/");
          return require(relative);
        }
        const parent = path.dirname(directory);
        if (parent === directory) {
          break;
        }
        directory = parent;
      }

      throw new Error("Could not locate subject_repositories/q/q.js from the test directory");
    }

    const hadOwnToString = Object.prototype.hasOwnProperty.call(process, "toString");
    const originalOwnToString = (process as any).toString;
    (process as any).toString = () => "[object Object]";

    const immediateCallbacks: Array<() => void> = [];
    const timeoutCallbacks: Array<() => void> = [];

    const originalSetImmediate = (global as any).setImmediate;
    const originalSetTimeout = (global as any).setTimeout;

    (global as any).setImmediate = (callback: any) => {
      immediateCallbacks.push(callback);
      return 0;
    };

    (global as any).setTimeout = (callback: any) => {
      timeoutCallbacks.push(callback);
      return 0;
    };

    let Q: any;
    try {
      Q = loadQUnderTest();
    } finally {
      if (hadOwnToString) {
        (process as any).toString = originalOwnToString;
      } else {
        delete (process as any).toString;
      }
    }

    try {
      const boom = new Error("boom");

      Q.nextTick(function () {
        throw boom;
      });

      // The queue flush is scheduled on a future turn of the event loop.
      if (immediateCallbacks.length > 0) {
        immediateCallbacks.shift()!();
      } else {
        expect(timeoutCallbacks.length).toBeGreaterThan(0);
        timeoutCallbacks.shift()!();
      }

      // The thrown error must be re-thrown asynchronously, not swallowed.
      expect(timeoutCallbacks.length).toBe(1);
      expect(() => timeoutCallbacks[0]()).toThrow(boom);
    } finally {
      (global as any).setImmediate = originalSetImmediate;
      (global as any).setTimeout = originalSetTimeout;
    }
  });
});