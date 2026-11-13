import tester from "../../../../../../../../../../../subject_repositories/pull-stream/util/tester.js";

describe("tester", () => {
  it("uses test.test(data) when passed an object with a test function", () => {
    const regexp = /abc/;
    const fn = tester(regexp);

    expect(fn("abc")).toBe(true);
    expect(fn("xyz")).toBe(false);
  });
});