import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Dirty } from "../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js";

describe("Dirty database loading", () => {
  it("loads a file containing a single large row with multi-byte UTF-8 characters", (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-test-"));
    const dbPath = path.join(dir, "db.txt");

    // A single row whose value is large enough to span multiple read-stream
    // chunks, containing multi-byte UTF-8 characters. With the original code
    // (encoding: 'utf-8') chunks are strings and the row parses correctly.
    // Without the encoding, chunks are Buffers; `buffer += chunk` decodes each
    // Buffer independently, corrupting multi-byte characters that straddle
    // chunk boundaries and causing the row to fail JSON.parse.
    const bigValue = "日本語テキスト".repeat(20000);
    const row = JSON.stringify({ key: "big", val: bigValue });
    fs.writeFileSync(dbPath, row + "\n", "utf-8");

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
        expect(count).toBe(1);
        expect(db.size()).toBe(1);
        expect(db.get("big")).toBe(bigValue);
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