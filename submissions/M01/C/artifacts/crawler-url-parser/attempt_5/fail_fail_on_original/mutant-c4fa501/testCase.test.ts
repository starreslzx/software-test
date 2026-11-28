import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser extract", () => {
  it("removes directory index URLs from the extracted link list", () => {
    const html = `
      <html>
        <body>
          <a href="/docs/index.html">Docs</a>
        </body>
      </html>
    `;

    const result = extract(html, "http://example.com/");
    const urls = result.map((entry: { url: string }) => entry.url);

    expect(urls).toContain("http://example.com/docs/");
    expect(urls).not.toContain("http://example.com/docs/index.html");
  });
});