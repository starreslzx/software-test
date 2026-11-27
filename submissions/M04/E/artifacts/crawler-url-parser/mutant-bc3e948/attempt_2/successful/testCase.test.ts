import * as fs from "fs";
import * as path from "path";

function resolveSubjectModule(): string {
  const candidatePartsList: string[][] = [
    ["subject_repositories", "crawler-url-parser", "crawler-url-parser.js"],
    ["subject_repositories", "crawler-url-parser", "src", "crawler-url-parser.js"],
    ["crawler-url-parser", "crawler-url-parser.js"],
    ["crawler-url-parser", "src", "crawler-url-parser.js"],
    ["crawler-url-parser.js"],
  ];

  const matches: string[] = [];
  const startDirectory = typeof __dirname !== "undefined" ? __dirname : process.cwd();
  let directory = startDirectory;

  for (let level = 0; level < 25; level++) {
    for (const parts of candidatePartsList) {
      const candidate = path.join(directory, ...parts);
      if (fs.existsSync(candidate)) {
        matches.push(candidate);
      }
    }
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }

  if (matches.length === 0) {
    throw new Error("Unable to locate crawler-url-parser.js");
  }

  const score = (file: string): number => {
    const segments = file.split(path.sep);
    const inSubjectRepositories = segments.includes("subject_repositories");
    const insideGeneratedTests = segments.includes("generated_tests");
    return (
      (inSubjectRepositories ? 0 : 100) +
      (insideGeneratedTests ? 10 : 0) +
      segments.length
    );
  };

  matches.sort((a, b) => score(a) - score(b));
  return matches[0];
}

const crawlerUrlParser = require(resolveSubjectModule());

describe("crawler-url-parser extract", () => {
  it("keeps the visible anchor text for extracted links", () => {
    const html =
      '<html><body><a href="https://example.com/page">Example Link</a></body></html>';

    const links = crawlerUrlParser.extract(html, "https://example.com/");

    const pageLink = links.find(
      (link: any) => link.url === "https://example.com/page"
    );

    expect(pageLink).toBeDefined();
    expect(pageLink.text).toBe("Example Link");
  });
});