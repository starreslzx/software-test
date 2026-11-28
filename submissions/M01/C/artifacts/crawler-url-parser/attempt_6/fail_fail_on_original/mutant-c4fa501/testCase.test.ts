import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser extract", () => {
  it("does not include directory index URLs in the extracted link list", () => {
    const html = `
      <html>
        <body>
          <a href="/docs/index.html">Docs</a>
        </body>
      </html>
    `;

    const result = extract(html, "http://example.com/");
    const urls = result.map((entry: { url: string }) => entry.url);

    expect(urls).not.toContain("http://example.com/docs/index.html");
  });
});