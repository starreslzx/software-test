import { extract } from "../../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js";

describe("extract", () => {
  it("stores an empty text when an anchor has no resolvable text content", () => {
    const anchorElement = { tagName: "a" };
    const href = "http://example.com/page";

    // A minimal cheerio-compatible double: `extract` accepts a pre-built
    // cheerio instance as its first argument, so we can supply the helpers it
    // relies on while making the anchor text collapse to null after trim().
    const fakeCheerio: any = (selector: any) => {
      if (selector === "a") {
        return {
          each: (callback: (index: number, element: any) => void) => {
            callback.call(anchorElement, 0, anchorElement);
          },
        };
      }

      if (selector === "base") {
        return { attr: () => undefined };
      }

      if (selector === anchorElement) {
        return {
          attr: (name: string) => (name === "href" ? href : undefined),
          text: () => ({ trim: () => null }),
        };
      }

      return { attr: () => undefined, text: () => ({ trim: () => "" }) };
    };

    const extracted = extract(fakeCheerio, "http://example.com/");

    expect(extracted).toHaveLength(1);
    expect(extracted[0].url).toBe("http://example.com/page");
    expect(extracted[0].text).toBe("");
  });
});