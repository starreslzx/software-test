import find from "../../../../../../../../../../../../subject_repositories/pull-stream/sinks/find.js";

describe("find sink", () => {
  it("treats a lone callback argument as the completion callback and emits the first truthy value", () => {
    const values = [17, 23, 42];
    let index = 0;

    const source = (abort: any, cb: (end: any, data?: any) => void) => {
      if (abort) {
        cb(abort);
        return;
      }

      if (index < values.length) {
        cb(null, values[index++]);
      } else {
        cb(true);
      }
    };

    const done = jest.fn();

    find(done)(source);

    expect(done).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith(null, 17);
  });
});