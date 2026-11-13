import prop from "../../../../../../../../../../../subject_repositories/pull-stream/util/prop.js";

describe("prop", () => {
  it("should support RegExp keys by executing them against the data", () => {
    const getMatch = prop(/ab+c/);

    expect(typeof getMatch).toBe("function");
    expect(getMatch("xxabbbcyy")).toBe("abbbc");
    expect(getMatch("no-match-here")).toBe(null);
  });
});