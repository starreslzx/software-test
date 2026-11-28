import * as fs from "fs";
import * as path from "path";

function locateQModule(startDirectory: string): string {
  const relativeCandidates = [
    path.join("subject_repositories", "q", "q.js"),
    path.join("q", "q.js"),
    "q.js",
  ];
  let directory = startDirectory;
  for (let depth = 0; depth < 25; depth++) {
    for (const relativeCandidate of relativeCandidates) {
      const candidatePath = path.join(directory, relativeCandidate);
      if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
        return candidatePath;
      }
    }
    const parentDirectory = path.dirname(directory);
    if (parentDirectory === directory) {
      break;
    }
    directory = parentDirectory;
  }
  throw new Error("Unable to locate the q.js module");
}

describe("Q.nextTick scheduling outside of a Node process", () => {
  it("schedules and runs a queued task when setImmediate is the only available ticker", () => {
    const qPath = locateQModule(__dirname);
    const realProcess = global.process;
    const realSetImmediate = (global as any).setImmediate;

    const fakeProcess = new Proxy(realProcess, {
      get(target: any, property: PropertyKey) {
        if (property === "toString") {
          return () => "[object Object]";
        }
        return Reflect.get(target, property);
      },
    });

    let Q: any;
    try {
      (global as any).process = fakeProcess;
      (global as any).setImmediate = (callback: () => void) => {
        callback();
      };
      jest.isolateModules(() => {
        Q = require(qPath);
      });
    } finally {
      (global as any).process = realProcess;
    }

    const task = jest.fn();
    try {
      expect(Q).toBeDefined();
      expect(typeof Q.nextTick).toBe("function");
      expect(() => Q.nextTick(task)).not.toThrow();
      expect(task).toHaveBeenCalledTimes(1);
    } finally {
      (global as any).setImmediate = realSetImmediate;
    }
  });
});