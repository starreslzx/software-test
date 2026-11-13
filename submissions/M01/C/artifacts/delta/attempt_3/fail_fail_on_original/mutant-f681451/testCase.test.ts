import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta transform", () => {
  it("does not emit a retain for a delete in this delta when other retains", () => {
    const thisDelta = new Delta().delete(3).retain(2);
    const otherDelta = new Delta().retain(5);

    const result = thisDelta.transform(otherDelta, false);

    expect(result.ops).toEqual([{ retain: 2 }]);
  });
});