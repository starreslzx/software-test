import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Dirty from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty flush behavior with multiple queued keys", () => {
  it("writes all queued keys to disk even when the write stream signals backpressure", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db");

    const db = new Dirty(dbPath);

    db.on("load", () => {
      // Queue multiple keys before flushing completes. We set them synchronously
      // so they all end up in the queue for the same _flush pass.
      let completed = 0;
      const total = 5;

      const onWrite = (err?: Error | null) => {
        if (err) {
          done(err);
          return;
        }
        completed++;
        if (completed === total) {
          // Reopen the database and verify all keys were persisted.
          const db2 = new Dirty(dbPath);
          db2.on("load", () => {
            try {
              for (let i = 0; i < total; i++) {
                expect(db2.get(`key${i}`)).toBe(`value${i}`);
              }
              expect(db2.size()).toBe(total);
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