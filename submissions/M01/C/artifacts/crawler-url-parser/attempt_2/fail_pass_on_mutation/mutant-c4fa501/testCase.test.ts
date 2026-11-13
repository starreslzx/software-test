import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser extract", () => {
  it("keeps directory index URLs in extracted links", () => {
    const html = `
      <html>
        <body>
          <a href="/docs/index.html">Docs Index</a>
          <a href="/about">About</a>
        </body>
      </html>
    `;

    const result = extract(html, "http://example.com/");

    const urls = result.map((entry: { url: string }) => entry.url);

    expect(urls).toContain("http://example.com/about");
    expect(urls).toContain("http://example.com/docs/index.html");
  });
});