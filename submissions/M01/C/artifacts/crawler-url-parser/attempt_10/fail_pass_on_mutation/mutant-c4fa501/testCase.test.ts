import { gettype } from "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("crawler-url-parser gettype", () => {
  it("classifies a directory index link as sublevel relative to the page root", () => {
    const type = gettype("http://example.com/docs/index.html", "http://example.com/");

    expect(type).toBe("sublevel");
  });
});