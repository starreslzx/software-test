import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Dirty from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty flush behavior when write stream signals backpressure", () => {
  it("still writes subsequent queued keys after a backpressure signal", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db");

    const db = new Dirty(dbPath);

    db.on("load", () => {
      // Force the underlying write stream to report backpressure on the very
      // first write by overriding `write` to return false once. This makes
      // `_waitForDrain` become true after the first key is written. The
      // original code breaks out of the loop only when `_waitForDrain` is
      // true (which it is here), so the remaining queued keys stay in the
      // queue and get flushed later. The mutated code always breaks, which
      // would also leave them queued — but the crucial difference is what
      // happens on the subsequent `drain` event: the original continues to
      // flush the remaining keys, while the mutant's `_flush` will break
      // immediately again on the next invocation, so the remaining keys
      // never get written.
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
  });
});