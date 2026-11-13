import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Dirty } from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty database loading", () => {
  it("loads rows containing multi-byte UTF-8 characters from an existing file", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db.txt");

    // Write rows containing multi-byte UTF-8 characters. Without an explicit
    // 'utf-8' encoding on the read stream, chunks arrive as Buffers and string
    // concatenation produces mojibake / broken JSON, so loading fails.
    const rows: string[] = [];
    for (let i = 0; i < 500; i++) {
      rows.push(JSON.stringify({ key: `key${i}`, val: `日本語のテキスト-${i}` }));
    }
    fs.writeFileSync(dbPath, rows.join("\n") + "\n", "utf-8");

    const db = new Dirty(dbPath);

    db.on("error", (err: Error) => {
      db.close();
      fs.rmSync(dir, { recursive: true, force: true });
      done(err);
    });

    db.on("load", (count: number) => {
      try {
        expect(count).toBe(500);
        expect(db.get("key0")).toBe("日本語のテキスト-0");
        expect(db.get("key499")).toBe("日本語のテキスト-499");
        expect(db.size()).toBe(500);
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