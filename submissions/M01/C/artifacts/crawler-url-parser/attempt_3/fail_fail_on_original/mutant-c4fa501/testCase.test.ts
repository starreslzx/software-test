import { parse } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser parse", () => {
  it("normalizes directory index URLs by removing the index file", () => {
    const result = parse("http://example.com/docs/index.html");

    expect(result).not.toBeNull();
    expect(result.url).toBe("http://example.com/docs/");
  });
});