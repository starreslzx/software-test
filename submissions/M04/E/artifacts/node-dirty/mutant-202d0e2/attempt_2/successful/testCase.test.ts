import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function loadDirty(): any {
  for (let depth = 10; depth <= 20; depth += 1) {
    const modulePath =
      "../".repeat(depth) + "subject_repositories/node-dirty/lib/dirty/dirty.js";
    try {
      return require(modulePath);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "MODULE_NOT_FOUND") {
        throw err;
      }
    }
  }
  throw new Error("Unable to locate the node-dirty module");
}

describe("Dirty", () => {
  it("keeps writing queued keys after the underlying file stream drains", async () => {
    const Dirty = loadDirty();

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db.txt");

    const db = new Dirty(dbPath);
    await new Promise<void>((resolve) => db.once("load", resolve));

    const bigValue = "a".repeat(1024 * 1024);

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new Error(
            "The queued write was never persisted after the stream drained",
          ),
        );
      }, 5000);

      let remaining = 2;
      const onPersisted = (err?: Error | null) => {
        if (err) {
          clearTimeout(timer);
          reject(err);
          return;
        }
        remaining -= 1;
        if (remaining === 0) {
          clearTimeout(timer);
          resolve();
        }
      };

      db.set("big", bigValue, onPersisted);
      db.set("small", "hello", onPersisted);
    });

    const persisted = fs.readFileSync(dbPath, "utf8");
    expect(persisted).toContain('"key":"big"');
    expect(persisted).toContain('{"key":"small","val":"hello"}');

    await new Promise<void>((resolve) => {
      db.once("write_close", resolve);
      db.close();
    });

    fs.unlinkSync(dbPath);
    fs.rmdirSync(dir);
  }, 20000);
});