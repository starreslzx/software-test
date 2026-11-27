import { extract } from "../../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("extract", () => {
  it("merges text for multiple links pointing to the same URL", () => {
    const html = `
      <html>
        <body>
          <a href="/docs/page">First link text</a>
          <a href="/docs/page">Second link text</a>
        </body>
      </html>
    `;

    const results = extract(html, "http://example.com/");

    expect(results).toHaveLength(1);
    expect(results[0].url).toBe("http://example.com/docs/page");
    expect(results[0].text).toBe("First link text Second link text");
  });
});