import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Dirty } from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty database loading", () => {
  it("loads rows from a file whose rows contain multi-byte UTF-8 characters", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db.txt");

    // Write rows with multi-byte UTF-8 characters. The original code opens the
    // read stream with encoding 'utf-8', so chunks are strings and rows parse
    // correctly. Without the encoding, chunks are Buffers; concatenating them
    // into the string `buffer` corrupts multi-byte characters that straddle
    // chunk boundaries, producing "Could not load corrupted row" errors.
    const rows: string[] = [];
    for (let i = 0; i < 3000; i++) {
      rows.push(JSON.stringify({ key: `key${i}`, val: `日本語のテキスト-${i}` }));
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
        expect(count).toBe(3000);
        expect(db.size()).toBe(3000);
        expect(db.get("key0")).toBe("日本語のテキスト-0");
        expect(db.get("key2999")).toBe("日本語のテキスト-2999");
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