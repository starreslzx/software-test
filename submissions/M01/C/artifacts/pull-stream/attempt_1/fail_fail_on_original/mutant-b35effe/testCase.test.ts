import find from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/find.js";

describe("find sink", () => {
  it("calls back with the matching value and null error when a match is found", (done) => {
    const source = (abort: any, cb: any) => {
      let i = 0;
      const values = [1, 2, 3, 4, 5];
      return function next(end: any, dataCb: any) {
        if (end === true) {
          return dataCb(true);
        }
        if (end) {
          return dataCb(end);
        }
        if (i >= values.length) {
          return dataCb(true);
        }
        dataCb(null, values[i++]);
      };
    };

    find((x: number) => x === 3, (err: any, value: any) => {
      expect(err).toBeNull();
      expect(value).toBe(3);
      done();
    })(source);
  });
});