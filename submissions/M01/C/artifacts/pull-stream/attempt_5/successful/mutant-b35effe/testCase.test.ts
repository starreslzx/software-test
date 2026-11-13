import find from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/find.js";

describe("find sink", () => {
  it("calls back with the error when the source ends with an error", (done) => {
    const source = function read(this: any, abort: any, cb: any) {
      if (abort) return cb(abort);
      return cb(new Error("boom"));
    };

    find((x: number) => x === 99, (err: any, value: any) => {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe("boom");
      expect(value).toBeNull();
      done();
    })(source);
  });
});