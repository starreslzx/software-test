import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Dirty from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty flush with backpressure", () => {
  it("continues flushing remaining queued keys after backpressure clears", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db");

    const db = new Dirty(dbPath);

    db.on("load", () => {
      const ws = (db as any)._writeStream;
      const originalWrite = ws.write.bind(ws);
      let firstWrite = true;
      ws.write = (chunk: any, cb: any) => {
        const result = originalWrite(chunk, cb);
        if (firstWrite) {
          firstWrite = false;
          // Simulate backpressure on the first write.
          return false;
        }
        return result;
      };

      // Manually emit a 'drain' after a short delay to simulate the stream
      // becoming writable again. In the original code, this triggers a
      // re-flush that writes the remaining queued keys. In the mutated code,
      // the re-flush breaks immediately (because `if (true) break;`), so the
      // remaining keys never get written.
      const scheduleDrain = () => {
        setTimeout(() => {
          ws.emit("drain");
        }, 50);
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

      scheduleDrain();
    });
  }, 15000);
});