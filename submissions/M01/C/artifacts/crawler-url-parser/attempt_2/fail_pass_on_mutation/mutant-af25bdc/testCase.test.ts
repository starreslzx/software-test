import { parse } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser", () => {
  it("should parse a standard URL into its components", () => {
    const result = parse("http://www.example.com/path/to/page?foo=bar&baz=qux");
    expect(result).not.toBeNull();
    expect(result.url).toBe("http://www.example.com/path/to/page?foo=bar&baz=qux");
    expect(result.protocol).toBe("http:");
    expect(result.host).toBe("www.example.com");
    expect(result.domain).toBe("example.com");
    expect(result.subdomain).toBe("www");
    expect(result.path).toBe("/path/to/page");
    expect(result.search).toBe("?foo=bar&baz=qux");
    expect(result.querycount).toBe(2);
  });
});