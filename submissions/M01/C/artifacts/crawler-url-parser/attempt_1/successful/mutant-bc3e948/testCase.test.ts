import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("extract", () => {
  it("preserves the anchor text for extracted links", () => {
    const html = `
      <html>
        <body>
          <a href="http://www.example.com/page1">First Link</a>
          <a href="http://www.example.com/page2">Second Link</a>
        </body>
      </html>
    `;
    const sourceUrl = "http://www.example.com/";

    const result = extract(html, sourceUrl);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "http://www.example.com/page1",
          text: "First Link",
        }),
        expect.objectContaining({
          url: "http://www.example.com/page2",
          text: "Second Link",
        }),
      ])
    );
  });
});