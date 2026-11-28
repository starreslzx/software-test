import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Dirty from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty close behavior with pending writes", () => {
  it("waits for pending writes to drain before closing streams", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-close-"));
    const dbPath = path.join(dir, "db.json");

    const db = new Dirty(dbPath);

    let writeCallbackFired = false;
    let writeCloseFired = false;

    db.on("load", () => {
      db.set("key", "value", () => {
        writeCallbackFired = true;
      });

      // Request close immediately while writes may still be in flight.
      db.close();

      db.on("write_close", () => {
        writeCloseFired = true;
      });

      setTimeout(() => {
        try {
          expect(writeCallbackFired).toBe(true);
          expect(writeCloseFired).toBe(true);
          expect(fs.existsSync(dbPath)).toBe(true);
          const contents = fs.readFileSync(dbPath, "utf-8");
          expect(contents).toContain('"val":"value"');
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
      }, 200);
    });
  });
});