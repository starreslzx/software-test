import { extract } from "../../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser extract", () => {
  it("skips anchor hrefs shorter than three characters", () => {
    const html = `
      <html>
        <body>
          <a href="/valid-page">Valid Page</a>
          <a href="ab">Short Link</a>
        </body>
      </html>
    `;

    const links = extract(html, "http://www.example.com/");
    const urls = links.map((link: any) => link.url).sort();

    expect(urls).toEqual(["http://www.example.com/valid-page"]);
  });
});