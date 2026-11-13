import drain from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/drain.js";

describe("drain sink", () => {
  it("does not call a missing done callback when the stream ends", () => {
    // A source that ends immediately (end === true) without producing data.
    let readCalls = 0;
    const source = (end: any, cb: (end: any, data?: any) => void) => {
      readCalls++;
      cb(true);
    };

    const sink = drain(() => true);

    // With no `done` callback supplied, the original code must not attempt to
    // invoke it when the stream ends. The mutated code calls `done(...)`
    // unconditionally, which throws a TypeError because `done` is undefined.
    expect(() => {
      sink(source);
    }).not.toThrow();
  });
});