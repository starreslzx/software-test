import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser extract", () => {
  it("does not include directory index URLs as separate entries", () => {
    const html = `
      <html>
        <body>
          <a href="/docs/index.html">Docs</a>
          <a href="/docs/">Docs Root</a>
        </body>
      </html>
    `;

    const result = extract(html, "http://example.com/");
    const urls = result.map((entry: { url: string }) => entry.url);

    expect(urls).toContain("http://example.com/docs/");
    expect(urls).not.toContain("http://example.com/docs/index.html");
  });
});