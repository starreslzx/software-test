import Delta, { Op, OpIterator, AttributeMap } from "../../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";

describe("Delta module CommonJS export", () => {
  it("exposes the Delta constructor as the module export", () => {
    const modulePath =
      "../../../../../../../../../../../../subject_repositories/delta/src/Delta.ts";
    const DeltaModule = jest.requireActual(modulePath) as any;

    expect(typeof DeltaModule).toBe("function");
    expect(DeltaModule).toBe(Delta);
    expect(DeltaModule.default).toBe(Delta);
    expect(DeltaModule.Op).toBe(Op);
    expect(DeltaModule.OpIterator).toBe(OpIterator);
    expect(DeltaModule.AttributeMap).toBe(AttributeMap);

    const delta = new DeltaModule()
      .insert("Hello", { bold: true })
      .retain(2)
      .delete(1);

    expect(delta.ops).toEqual([
      { insert: "Hello", attributes: { bold: true } },
      { retain: 2 },
      { delete: 1 },
    ]);
  });
});