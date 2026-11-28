import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function findSubjectModule(start: string): string | null {
  let current = start;

  for (let depth = 0; depth < 100; depth += 1) {
    const candidate = path.join(
      current,
      "subject_repositories",
      "node-jsonfile",
      "index.js"
    );

    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }

    current = parent;
  }

  return null;
}

describe("jsonfile fallback to core fs", () => {
  it("reads JSON when graceful-fs cannot be required", () => {
    const subjectPath =
      findSubjectModule(__dirname) ?? findSubjectModule(process.cwd());

    if (!subjectPath) {
      throw new Error(
        "Could not locate subject_repositories/node-jsonfile/index.js"
      );
    }

    let gracefulFsPath: string | undefined;
    try {
      gracefulFsPath = (require.resolve as any)("graceful-fs", {
        paths: [path.dirname(subjectPath)],
      });
    } catch {
      gracefulFsPath = undefined;
    }

    const relativeSubjectPath = path.relative(__dirname, subjectPath);

    jest.resetModules();

    if (gracefulFsPath) {
      jest.doMock(gracefulFsPath, () => {
        throw new Error("graceful-fs is unavailable");
      });
    }

    const jsonfile = require(relativeSubjectPath);

    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "jsonfile-fallback-")
    );

    try {
      const file = path.join(directory, "data.json");
      const contents = { name: "jsonfile", values: [1, 2, 3] };
      fs.writeFileSync(file, JSON.stringify(contents), "utf8");

      expect(jsonfile.readFileSync(file)).toEqual(contents);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
});