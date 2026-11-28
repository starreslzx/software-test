import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta transform", () => {
  it("does not emit a retain when this delta deletes at the same position as other retains", () => {
    const thisDelta = new Delta().retain(2).delete(3).retain(2);
    const otherDelta = new Delta().retain(7);

    const result = thisDelta.transform(otherDelta, false);

    expect(result.ops).toEqual([{ retain: 2 }]);
  });
});