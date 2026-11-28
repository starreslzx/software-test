import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function loadDirty(): any {
  const relative = path.join(
    "subject_repositories",
    "node-dirty",
    "lib",
    "dirty",
    "dirty.js"
  );

  let dir = __dirname;
  for (let depth = 0; depth < 50; depth++) {
    const candidate = path.join(dir, relative);
    if (fs.existsSync(candidate)) {
      return require(candidate);
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  throw new Error("Unable to locate the node-dirty subject module");
}

describe("Dirty write flushing", () => {
  it("persists every write queued while the write stream is applying backpressure", (done) => {
    const Dirty = loadDirty();
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-flush-"));
    const dbPath = path.join(tempDir, "data.db");
    const db = Dirty(dbPath);

    const completed: string[] = [];
    let triggerIssued = false;
    let finished = false;

    const finish = (error?: Error | null) => {
      if (finished) {
        return;
      }
      finished = true;
      try {
        if (db._writeStream) db._writeStream.destroy();
      } catch (e) {}
      try {
        if (db._readStream) db._readStream.destroy();
      } catch (e) {}
      try {
        (fs as any).rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {}
      done(error || undefined);
    };

    db.on("error", (error: Error) => finish(error));

    db.on("drain", () => {
      if (!triggerIssued || finished) {
        return;
      }
      setImmediate(() => {
        if (finished) {
          return;
        }
        try {
          expect(completed).toEqual(["q1", "q2", "q3"]);
          finish();
        } catch (error) {
          finish(error as Error);
        }
      });
    });

    db.on("load", () => {
      db.set("big", "x".repeat(2 * 1024 * 1024), (error: Error | null) => {
        if (error) {
          finish(error);
          return;
        }
        setImmediate(() => {
          triggerIssued = true;
          db.set("trigger", "t", (triggerError: Error | null) => {
            if (triggerError) {
              finish(triggerError);
            }
          });
        });
      });

      db.set("q1", "1", (error: Error | null) => {
        if (error) {
          return finish(error);
        }
        completed.push("q1");
      });

      db.set("q2", "2", (error: Error | null) => {
        if (error) {
          return finish(error);
        }
        completed.push("q2");
      });

      db.set("q3", "3", (error: Error | null) => {
        if (error) {
          return finish(error);
        }
        completed.push("q3");
      });
    });
  });
});