import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Dirty from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty close behavior with pending writes", () => {
  it("defers closing until pending writes are flushed and drained", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-close-"));
    const dbPath = path.join(dir, "db.json");

    const db = new Dirty(dbPath);

    const events: string[] = [];

    db.on("load", () => {
      db.set("key", "value", () => {
        events.push("write-cb");
      });

      // Request close immediately while the write is still in flight.
      db.close();

      db.on("write_close", () => {
        events.push("write_close");
      });

      setTimeout(() => {
        try {
          // The write callback must fire before the write stream is closed.
          expect(events).toContain("write-cb");
          expect(events).toContain("write_close");
          expect(events.indexOf("write-cb")).toBeLessThan(
            events.indexOf("write_close"),
          );
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