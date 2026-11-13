import { parse } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser parse", () => {
  it("parses a directory index URL preserving its path", () => {
    const result = parse("http://example.com/docs/index.html");

    expect(result).not.toBeNull();
    expect(result!.url).toBe("http://example.com/docs/index.html");
    expect(result!.path).toBe("/docs/index.html");
    expect(result!.host).toBe("example.com");
  });
});