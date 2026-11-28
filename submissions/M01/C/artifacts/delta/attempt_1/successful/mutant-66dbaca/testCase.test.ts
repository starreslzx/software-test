import Delta from "../../../../../../../../../../../subject_repositories/delta/src/Delta";

describe("Delta module exports", () => {
  it("exports Delta as the CommonJS module export", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const required = require("../../../../../../../../../../../subject_repositories/delta/src/Delta");
    const RequiredDelta = required.default || required;

    const delta = new RequiredDelta().insert("Hello");
    expect(delta.ops).toEqual([{ insert: "Hello" }]);

    // The module export itself should be the Delta constructor
    expect(typeof required).toBe("function");
    expect(required).toBe(RequiredDelta);
    expect(required.default).toBe(RequiredDelta);

    const instance = new required();
    expect(instance).toBeInstanceOf(Delta);
    expect(instance.ops).toEqual([]);
  });
});