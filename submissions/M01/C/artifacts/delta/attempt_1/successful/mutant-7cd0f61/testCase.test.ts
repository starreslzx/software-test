import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta.diff error message", () => {
  it("reports 'with' when the receiver is not a document", () => {
    const nonDocument = new Delta().retain(1);
    const document = new Delta().insert("a");

    let message = "";
    try {
      nonDocument.diff(document);
    } catch (e) {
      message = (e as Error).message;
    }

    expect(message).toBe("diff() called with non-document");
  });
});