import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function findDirtyLibrary(start: string): string | null {
  let dir = start;
  while (true) {
    const reposDir = path.join(dir, "subject_repositories");
    if (fs.existsSync(reposDir)) {
      const entries = fs.readdirSync(reposDir).sort((a, b) => {
        const aDirty = a.toLowerCase().includes("dirty") ? 0 : 1;
        const bDirty = b.toLowerCase().includes("dirty") ? 0 : 1;
        return aDirty - bDirty || a.localeCompare(b);
      });
      for (const entry of entries) {
        const candidate = path.join(reposDir, entry, "lib", "dirty", "dirty.js");
        if (fs.existsSync(candidate)) return candidate;
      }
    }

    const direct = path.join(dir, "node-dirty", "lib", "dirty", "dirty.js");
    if (fs.existsSync(direct)) return direct;

    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function loadDirty(): any {
  for (const start of [__dirname, process.cwd()]) {
    const libraryPath = findDirtyLibrary(start);
    if (!libraryPath) continue;

    const relativePath = path
      .relative(__dirname, libraryPath)
      .split(path.sep)
      .join("/");

    return require(relativePath.startsWith(".") ? relativePath : `./${relativePath}`);
  }
  throw new Error("Could not locate the node-dirty library for the test");
}

const Dirty = loadDirty();

describe("Dirty database file loading", () => {
  it("loads multibyte characters that are split across read stream chunks", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dirty-chunk-"));
    const dbPath = path.join(tempDir, "db");

    const prefix = '{"key":"k","val":"';
    // Place the first byte of the 3-byte euro sign on the last byte of the
    // first 64 KiB read chunk, so the character straddles two chunks.
    const padding = "a".repeat(65536 - prefix.length - 1);
    const expectedValue = `${padding}€${"b".repeat(100)}`;

    fs.writeFileSync(dbPath, `${prefix}${expectedValue}"}\n`, "utf8");

    const db = new Dirty(dbPath);

    try {
      await new Promise<void>((resolve, reject) => {
        db.once("load", () => resolve());
        db.once("error", (error: Error) => reject(error));
      });

      expect(db.get("k")).toBe(expectedValue);
    } finally {
      await new Promise<void>((resolve) => {
        db.once("write_close", () => resolve());
        db.close();
      });
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});