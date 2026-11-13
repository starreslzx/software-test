import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Dirty from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty close behavior with pending writes", () => {
  it("defers closing the write stream until queued writes are flushed", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-close-"));
    const dbPath = path.join(dir, "db.json");

    const db = new Dirty(dbPath);

    let writeCloseFired = false;
    let writeCallbackFired = false;

    db.on("load", () => {
      db.set("key", "value", () => {
        writeCallbackFired = true;
      });

      // Request close immediately while the write is still queued/in flight.
      db.close();

      db.on("write_close", () => {
        writeCloseFired = true;
      });

      // Check shortly after close is requested but before the write has
      // necessarily completed. In the original code, close() defers because
      // there are pending writes, so the write stream must NOT be closed yet.
      setTimeout(() => {
        try {
          expect(writeCloseFired).toBe(false);
          expect(writeCallbackFired).toBe(false);
          done();
        } catch (err) {
          done(err);
        } finally {
          try {
            fs.rmSync(dir, { recursive: true, force: true });
          } catch (e) {
            // ignore cleanup errors
          }
        }
      }, 0);
    });
  });
});