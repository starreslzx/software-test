type Drain = (
  op?: (data: unknown) => boolean | void,
  done?: (err: unknown) => void
) => (
  read: (end: unknown, cb: (end: unknown, data?: unknown) => void) => void
) => void;

const drain: Drain = (() => {
  try {
    return require("../../../../../../../../../../subject_repositories/pull-stream/sinks/drain.js");
  } catch {
    return require("../../../../../../../../../../../../subject_repositories/pull-stream/sinks/drain.js");
  }
})();

describe("drain", () => {
  test("throws the source error when no done callback is supplied", () => {
    const sourceError = new Error("drain source failed");
    const source = (_end: unknown, cb: (end: unknown, data?: unknown) => void) => {
      cb(sourceError);
    };

    const sink = drain();

    expect(() => sink(source)).toThrow("drain source failed");
  });
});