function loadDrain(): any {
  const candidates = [
    "../../../../../../../../../../subject_repositories/pull-stream/sinks/drain.js",
    "../../../../../../../../../../../subject_repositories/pull-stream/sinks/drain.js",
    "../../../../../../../../../../../../subject_repositories/pull-stream/sinks/drain.js",
    "../../../../../../../../../../../../../subject_repositories/pull-stream/sinks/drain.js"
  ];

  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (error) {
      if (!error || (error as any).code !== "MODULE_NOT_FOUND") {
        throw error;
      }
    }
  }

  throw new Error("Could not load drain");
}

describe("drain sink", () => {
  it("does not require a done callback when the source ends normally", () => {
    const drain = loadDrain();
    const sink = drain();

    expect(() => {
      sink((_end: any, cb: (end: any, data?: any) => void) => {
        cb(true);
      });
    }).not.toThrow();
  });
});