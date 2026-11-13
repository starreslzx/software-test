import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta transform", () => {
  it("skips emitting a retain when this delta deletes at the same position as other retains", () => {
    const thisDelta = new Delta().retain(2).delete(3).retain(2);
    const otherDelta = new Delta().retain(7);

    const result = thisDelta.transform(otherDelta, false);

    expect(result.ops).toEqual([{ retain: 2 }]);
  });
});