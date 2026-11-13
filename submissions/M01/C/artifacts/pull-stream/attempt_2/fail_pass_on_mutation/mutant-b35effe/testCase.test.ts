import find from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/find.js";

describe("find sink", () => {
  it("calls back with null error when a matching value is found", (done) => {
    const values = [1, 2, 3, 4, 5];
    let i = 0;

    const source = function read(this: any, abort: any, cb: any) {
      if (abort) return cb(abort);
      if (i >= values.length) return cb(true);
      cb(null, values[i++]);
    };

    find((x: number) => x === 3, (err: any, value: any) => {
      expect(err).toBeNull();
      expect(value).toBe(3);
      done();
    })(source);
  });
});