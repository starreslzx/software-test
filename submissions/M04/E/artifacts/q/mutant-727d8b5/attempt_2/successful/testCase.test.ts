import * as fs from "fs";
import * as path from "path";

function locateQ(): any {
  let dir = __dirname;
  for (let depth = 0; depth < 20; depth++) {
    const candidates = [
      path.join(dir, "subject_repositories", "q", "q.js"),
      path.join(dir, "q", "q.js"),
      path.join(dir, "q.js"),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return require(candidate);
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error("Unable to locate q.js");
}

const Q: any = locateQ();

describe("Q.any progress notifications", () => {
  it("forwards progress notifications from its input promises with the index and progress value", async () => {
    const first = Q.defer();
    const second = Q.defer();
    const anyPromise = Q.any([first.promise, second.promise]);
    const notifications: Array<{ index: number; value: any }> = [];

    Q.progress(anyPromise, (progress: { index: number; value: any }) => {
      notifications.push(progress);
    });

    first.notify("half way");
    Q.nextTick(() => {
      first.resolve("first value");
    });

    const value = await anyPromise;

    expect(value).toBe("first value");
    expect(notifications).toEqual([{ index: 0, value: "half way" }]);
  });
});