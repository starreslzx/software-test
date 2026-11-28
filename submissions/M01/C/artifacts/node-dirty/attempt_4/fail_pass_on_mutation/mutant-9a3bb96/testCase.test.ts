import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Dirty from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty close behavior with pending writes", () => {
  it("does not destroy the write stream while writes are still in flight", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-close-"));
    const dbPath = path.join(dir, "db.json");

    const db = new Dirty(dbPath);

    let writeError: Error | null = null;
    let writeCallbackFired = false;

    db.on("error", (err: Error) => {
      writeError = err;
    });

    db.on("load", () => {
      // Queue many writes to ensure some are still in flight.
      for (let i = 0; i < 50; i++) {
        db.set("key" + i, "value" + i, () => {
          if (i === 49) writeCallbackFired = true;
        });
      }

      // Request close immediately while writes are still in flight.
      db.close();

      setTimeout(() => {
        try {
          expect(writeError).toBeNull();
          expect(writeCallbackFired).toBe(true);
          const contents = fs.readFileSync(dbPath, "utf-8");
          // All writes should have been persisted.
          for (let i = 0; i < 50; i++) {
            expect(contents).toContain(`"val":"value${i}"`);
          }
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
      }, 300);
    });
  });
});