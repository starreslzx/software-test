import Delta from "../../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta transform", () => {
  it("uses the transformed length when the other retain is null", () => {
    const thisDelta = new Delta([{ retain: 1 }]);
    const otherDelta = new Delta([{ retain: 1 }]);

    const OpIterator = (Delta as any).OpIterator;
    const originalNext = OpIterator.prototype.next;

    OpIterator.prototype.next = function (this: any, length?: number) {
      const op = originalNext.call(this, length);
      if (this.ops === otherDelta.ops) {
        op.retain = null;
      }
      return op;
    };

    try {
      const transformed = thisDelta.transform(otherDelta);
      expect(transformed.ops).toEqual([]);
    } finally {
      OpIterator.prototype.next = originalNext;
    }
  });
});