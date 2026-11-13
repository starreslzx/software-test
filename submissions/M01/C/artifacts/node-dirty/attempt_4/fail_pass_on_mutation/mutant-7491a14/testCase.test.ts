import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Dirty } from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty database loading", () => {
  it("emits a load event with the correct count for a file with many rows", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db.txt");

    // Write a large number of rows so the read stream delivers multiple chunks.
    // With the original code (encoding: 'utf-8'), the 'data' handler receives
    // strings. Without the encoding, chunks are Buffers; `buffer += chunk`
    // coerces each Buffer via toString() which can split multi-byte characters
    // and corrupt rows spanning chunk boundaries.
    const rows: string[] = [];
    for (let i = 0; i < 20000; i++) {
      rows.push(JSON.stringify({ key: `key${i}`, val: `値-${i}-日本語テキスト` }));
    }
    fs.writeFileSync(dbPath, rows.join("\n") + "\n", "utf-8");

    const db = new Dirty(dbPath);

    let finished = false;
    db.on("error", (err: Error) => {
      if (finished) return;
      finished = true;
      db.close();
      fs.rmSync(dir, { recursive: true, force: true });
      done(err);
    });

    db.on("load", (count: number) => {
      if (finished) return;
      finished = true;
      try {
        expect(count).toBe(20000);
        expect(db.size()).toBe(20000);
        expect(db.get("key0")).toBe("値-0-日本語テキスト");
        expect(db.get("key19999")).toBe("値-19999-日本語テキスト");
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