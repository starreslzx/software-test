const pull = require("../../../../../../../../../../../../subject_repositories/pull-stream/pull.js");

describe("pull", () => {
  test("passes through a single non-function source argument unchanged", () => {
    const source = [1];

    const result = pull(source);

    expect(result).toBe(source);
  });
});