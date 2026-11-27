const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

describe("crawler-url-parser main-module behavior", () => {
  it("prints the testing message when the file is executed as the main module", () => {
    let dir = __dirname;
    let subjectFilePath: string | null = null;

    while (true) {
      const candidate = path.join(
        dir,
        "subject_repositories",
        "crawler-url-parser",
        "crawler-url-parser.js"
      );
      if (fs.existsSync(candidate)) {
        subjectFilePath = candidate;
        break;
      }
      const parent = path.dirname(dir);
      if (parent === dir) {
        break;
      }
      dir = parent;
    }

    expect(subjectFilePath).not.toBeNull();

    const stdout = String(
      execFileSync(process.execPath, [subjectFilePath as string], {
        encoding: "utf8",
      })
    );

    expect(stdout).toContain("for testing purpose");
  });
});