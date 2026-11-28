import { parse } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser parse query parameter handling", () => {
  it("removes utm_ query parameters whose suffix contains a non-word character", () => {
    const result = parse("http://example.com/page?utm_source=newsletter&utm-medium=email&id=42");
    expect(result).not.toBeNull();
    expect(result!.search).toBe("?id=42");
  });
});