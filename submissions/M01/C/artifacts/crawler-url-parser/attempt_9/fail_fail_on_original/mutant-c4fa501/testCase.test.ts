import { parse, extract, gettype } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser", () => {
  it("provides consistent parsing and extraction behavior for directory index URLs", () => {
    const parsed = parse("http://example.com/docs/index.html");
    expect(parsed).not.toBeNull();
    expect(parsed!.url).toBe("http://example.com/docs/index.html");

    const html = `<html><body><a href="/docs/index.html">Docs</a></body></html>`;
    const extracted = extract(html, "http://example.com/");
    expect(extracted).toHaveLength(1);
    expect(extracted[0].url).toBe("http://example.com/docs/index.html");

    const type = gettype("http://example.com/docs/index.html", "http://example.com/");
    expect(type).toBe("internal");
  });
});