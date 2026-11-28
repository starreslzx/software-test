import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("extract text handling", () => {
  it("uses empty string for links without text content", () => {
    const html = '<html><body><a href="http://example.com/page"></a></body></html>';
    const result = extract(html, "http://example.com/");
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe("http://example.com/page");
    expect(result[0].text).toBe("");
  });
});