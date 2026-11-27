import Delta from "../../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta.compose", () => {
  it("composes a document with an empty delta without error", () => {
    const documentDelta = new Delta().insert("hello");
    const emptyDelta = new Delta();

    const result = documentDelta.compose(emptyDelta);

    expect(result.ops).toEqual([{ insert: "hello" }]);
  });
});