import * as fs from "fs";
import * as path from "path";

declare const __dirname: string;

function findCrawlerUrlParserSource(): string {
  let dir = __dirname;

  while (true) {
    const candidate = path.join(
      dir,
      "subject_repositories",
      "crawler-url-parser",
      "crawler-url-parser.js"
    );

    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, "utf8");
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error("Could not locate crawler-url-parser.js");
    }
    dir = parent;
  }
}

describe("crawler-url-parser URL normalization options", () => {
  test("keeps directory index removal enabled", () => {
    const source = findCrawlerUrlParserSource();

    expect(source).toMatch(/removeDirectoryIndex\s*:\s*true/);
  });
});