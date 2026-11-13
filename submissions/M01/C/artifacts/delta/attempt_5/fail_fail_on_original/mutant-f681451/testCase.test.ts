import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta transform", () => {
  it("does not emit a retain for a delete in this delta when other retains", () => {
    const thisDelta = new Delta().retain(2).delete(3);
    const otherDelta = new Delta().retain(5);

    const result = thisDelta.transform(otherDelta, false);

    expect(result.ops).toEqual([{ retain: 2 }]);
  });
});