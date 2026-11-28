import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser extract", () => {
  it("extracts links from a page with a directory index href", () => {
    const html = `
      <html>
        <body>
          <a href="/docs/index.html">Docs</a>
        </body>
      </html>
    `;

    const result = extract(html, "http://example.com/");

    expect(result).toHaveLength(1);
    expect(result[0].url).toBe("http://example.com/docs/index.html");
    expect(result[0].text).toBe("Docs");
  });
});