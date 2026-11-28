import { extract } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser extract", () => {
  it("skips javascript, mailto and ftp links and short hrefs", () => {
    const html = `
      <html>
        <body>
          <a href="javascript:void(0)">js link</a>
          <a href="mailto:someone@example.com">mail link</a>
          <a href="ftp://example.com/file.txt">ftp link</a>
          <a href="ab">short link</a>
          <a href="http://example.com/page">valid link</a>
        </body>
      </html>
    `;

    const result = extract(html, "http://example.com/");

    expect(result).toHaveLength(1);
    expect(result[0].url).toBe("http://example.com/page");
    expect(result[0].text).toBe("valid link");
  });
});