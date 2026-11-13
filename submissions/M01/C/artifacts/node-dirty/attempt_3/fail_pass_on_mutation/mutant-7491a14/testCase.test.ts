import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Dirty } from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty database loading", () => {
  it("loads rows containing multi-byte UTF-8 characters from an existing file", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db.txt");

    // Write many rows containing multi-byte UTF-8 characters. When the read
    // stream has no explicit 'utf-8' encoding, chunks arrive as Buffers and
    // concatenating them with the string buffer produces mojibake, breaking
    // JSON parsing of rows that span chunk boundaries.
    const rows: string[] = [];
    for (let i = 0; i < 5000; i++) {
      rows.push(JSON.stringify({ key: `key${i}`, val: `日本語のテキスト-${i}-αβγδε` }));
    }
    fs.writeFileSync(dbPath, rows.join("\n") + "\n", "utf-8");

    const db = new Dirty(dbPath);

    let errored = false;
    db.on("error", (err: Error) => {
      errored = true;
      db.close();
      fs.rmSync(dir, { recursive: true, force: true });
      done(err);
    });

    db.on("load", (count: number) => {
      if (errored) return;
      try {
        expect(count).toBe(5000);
        expect(db.get("key0")).toBe("日本語のテキスト-0-αβγδε");
        expect(db.get("key4999")).toBe("日本語のテキスト-4999-αβγδε");
        expect(db.size()).toBe(5000);
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