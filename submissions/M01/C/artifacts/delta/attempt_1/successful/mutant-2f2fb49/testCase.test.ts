import AttributeMap from "../../../../../../../../../../../subject_repositories/delta/src/AttributeMap.ts";

describe("AttributeMap.compose", () => {
  it("treats a non-object second argument as empty so the first argument's attributes survive", () => {
    const a = { bold: true, color: "red" };
    // b is not an object; original code normalizes it to {} and keeps a's attributes.
    const result = AttributeMap.compose(a, "not-an-object" as unknown as AttributeMap);

    expect(result).toEqual({ bold: true, color: "red" });
  });
});