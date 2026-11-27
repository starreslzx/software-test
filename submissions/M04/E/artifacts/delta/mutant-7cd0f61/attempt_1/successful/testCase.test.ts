import Delta from "../../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta.diff", () => {
  it("reports that the receiver is not a document when it contains non-insert operations", () => {
    const nonDocument = new Delta([{ retain: 1 }]);
    const document = new Delta([{ insert: "hello" }]);

    expect(() => nonDocument.diff(document)).toThrow(
      "diff() called with non-document",
    );
  });
});