import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Dirty from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty flush behavior with backpressure", () => {
  it("writes all queued keys to disk even when a write reports backpressure", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db");

    const db = new Dirty(dbPath);

    db.on("load", () => {
      // Override the write stream's `write` so that the *first* write returns
      // false (simulating backpressure) but subsequent writes return true.
      // In the original code, `_waitForDrain` becomes true after the first
      // write, so the loop breaks — but the remaining keys stay in the queue
      // and are flushed on the next `drain` event (where `_waitForDrain` is
      // false again, so the loop does NOT break prematurely). In the mutated
      // code, the loop always breaks, so on the `drain`-triggered flush the
      // loop breaks again immediately after the first key, leaving the rest
      // permanently stuck in the queue.
      const ws = (db as any)._writeStream;
      const originalWrite = ws.write.bind(ws);
      let firstWrite = true;
      ws.write = (chunk: any, cb: any) => {
        const result = originalWrite(chunk, cb);
        if (firstWrite) {
          firstWrite = false;
          return false;
        }
        return result;
      };

      let completed = 0;
      const total = 3;

      const onWrite = (err?: Error | null) => {
        if (err) {
          done(err);
          return;
        }
        completed++;
        if (completed === total) {
          const db2 = new Dirty(dbPath);
          db2.on("load", () => {
            try {
              for (let i = 0; i < total; i++) {
                expect(db2.get(`key${i}`)).toBe(`value${i}`);
              }
              db2.close();
              db.close();
              fs.rmSync(dir, { recursive: true, force: true });
              done();
            } catch (e) {
              fs.rmSync(dir, { recursive: true, force: true });
              done(e as Error);
            }
          });
        }
      };

      for (let i = 0; i < total; i++) {
        db.set(`key${i}`, `value${i}`, onWrite);
      }
    });
  }, 15000);
});