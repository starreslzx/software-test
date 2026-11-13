import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser extract", () => {
  it("merges text of duplicate links pointing to the same URL", () => {
    const html = `
      <html>
        <body>
          <a href="http://www.example.com/page">First</a>
          <a href="http://www.example.com/page">Second</a>
        </body>
      </html>
    `;

    const result = extract(html, "http://www.example.com/");

    const pageLink = result.find(
      (link: any) => link.url === "http://www.example.com/page"
    );

    expect(pageLink).toBeDefined();
    expect(pageLink.text).toBe("First Second");
  });
});