import { parse } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser parse query parameter handling", () => {
  it("removes utm_ query parameters whose suffix contains a non-word character", () => {
    const result = parse("http://example.com/page?utm_medium=email&utm-source=newsletter&id=42");
    expect(result).not.toBeNull();
    expect(result!.search).toBe("?utm_medium=email&id=42");
    expect(result!.querycount).toBe(2);
  });
});