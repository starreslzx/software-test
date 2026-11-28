import reduce from "../../../../../../../../../../../../subject_repositories/pull-stream/sinks/reduce.js";

describe("reduce sink", () => {
  test("handles an immediate end and propagates errors", () => {
    const reducer = (acc: any, data: any) => acc + data;

    // Source that ends immediately with `true` (normal termination).
    let normalEndErr: any = "not-called";
    let normalEndAcc: any = "not-called";
    const normalSource = (_end: any, cb: any) => {
      cb(true);
    };
    reduce(reducer, (err: any, acc: any) => {
      normalEndErr = err;
      normalEndAcc = acc;
    })(normalSource);
    expect(normalEndErr).toBe(null);
    expect(normalEndAcc).toBeUndefined();

    // Source that immediately fails with an error.
    const error = new Error("boom");
    let errorEndErr: any = "not-called";
    const errorSource = (_end: any, cb: any) => {
      cb(error);
    };
    reduce(reducer, (err: any) => {
      errorEndErr = err;
    })(errorSource);
    expect(errorEndErr).toBe(error);
  });
});