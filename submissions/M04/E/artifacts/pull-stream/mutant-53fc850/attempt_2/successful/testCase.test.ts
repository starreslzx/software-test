const moduleBase = "subject_repositories/pull-stream/util/tester.js";

const relativeCandidates = [
  "../../../../../../../../../../" + moduleBase,
  "../../../../../../../../../" + moduleBase,
  "../../../../../../../../../../../../" + moduleBase,
];

function loadTester(): any {
  for (const candidate of relativeCandidates) {
    try {
      return require(candidate);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("Cannot find module")) {
        throw error;
      }
    }
  }
  throw new Error("Could not locate util/tester.js");
}

const tester = loadTester();

describe("tester", () => {
  it("creates a matcher from a regexp using its test method", () => {
    const matchesHello = tester(/^hello$/);

    expect(matchesHello("hello")).toBe(true);
    expect(matchesHello("goodbye")).toBe(false);
  });
});