import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Dirty } from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty database loading", () => {
  it("loads existing rows from a file, including multi-byte UTF-8 characters split across chunks", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db.txt");

    // Build a file with a large number of rows so that the read stream
    // delivers multiple chunks. Include multi-byte UTF-8 characters.
    const rows: string[] = [];
    for (let i = 0; i < 2000; i++) {
      rows.push(JSON.stringify({ key: `key${i}`, val: `välüé-${i}-日本語` }));
    }
    fs.writeFileSync(dbPath, rows.join("\n") + "\n", "utf-8");

    const db = new Dirty(dbPath);

    db.on("error", (err: Error) => {
      done(err);
    });

    db.on("load", (count: number) => {
      try {
        expect(count).toBe(2000);
        expect(db.get("key0")).toBe("välüé-0-日本語");
        expect(db.get("key1999")).toBe("välüé-1999-日本語");
        expect(db.size()).toBe(2000);
        db.close();
        fs.rmSync(dir, { recursive: true, force: true });
        done();
      } catch (e) {
        db.close();
        fs.rmSync(dir, { recursive: true, force: true });
        done(e);
      }
    });
  });
});