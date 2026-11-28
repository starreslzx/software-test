import { EventEmitter } from "events";

const fs = require("fs");
const path = require("path");

function loadDirtyModule(): any {
  const tails = [
    ["subject_repositories", "node-dirty", "lib", "dirty", "dirty.js"],
    ["node-dirty", "lib", "dirty", "dirty.js"],
  ];

  let dir = __dirname;
  for (let i = 0; i < 30; i++) {
    for (const tail of tails) {
      const candidate = path.join(dir, ...tail);
      if (fs.existsSync(candidate)) {
        return require(candidate);
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error("Could not locate the node-dirty module");
}

class FakeWriteStream extends EventEmitter {
  public writeCallbacks: Array<(err?: Error | null) => void> = [];

  public cork(): void {}

  public uncork(): void {}

  public end(cb?: () => void): void {
    if (cb) cb();
  }

  public destroy(): void {}

  public write(_chunk: string, cb?: (err?: Error | null) => void): boolean {
    if (cb) this.writeCallbacks.push(cb);
    return false;
  }
}

class FakeReadStream extends EventEmitter {
  public destroy(): void {}
}

describe("Dirty drain notification", () => {
  it("emits drain when the write stream drains with an empty queue and no in-flight writes", () => {
    const Dirty = loadDirtyModule();

    const writeStream = new FakeWriteStream();
    const readStream = new FakeReadStream();

    const writeStreamSpy = jest
      .spyOn(fs, "createWriteStream")
      .mockImplementation(() => writeStream);
    const readStreamSpy = jest
      .spyOn(fs, "createReadStream")
      .mockImplementation(() => readStream);

    try {
      const db = new Dirty("dirty-test.db");
      let drainCount = 0;
      db.on("drain", () => {
        drainCount += 1;
      });

      db.set("key", "value");

      // The write reported backpressure, so exactly one write is now in flight
      // and there are no entries left in the write queue.
      expect(writeStream.writeCallbacks).toHaveLength(1);

      // Complete that write. It is still marked as waiting for a stream drain,
      // so no drain notification should be produced yet.
      writeStream.writeCallbacks[0]!();
      expect(drainCount).toBe(0);

      // The write stream now signals that it has drained. Since nothing is
      // queued and nothing is in flight, the database should announce drain.
      writeStream.emit("drain");

      expect(drainCount).toBe(1);
    } finally {
      writeStreamSpy.mockRestore();
      readStreamSpy.mockRestore();
    }
  });
});