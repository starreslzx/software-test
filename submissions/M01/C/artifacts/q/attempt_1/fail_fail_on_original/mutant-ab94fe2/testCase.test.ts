import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.done unhandled error", () => {
  it("throws unhandled errors from done callbacks on a future tick", (done) => {
    const error = new Error("boom");
    let caught: any = null;

    function onUncaughtException(err: any) {
      caught = err;
      process.removeListener("uncaughtException", onUncaughtException);
      try {
        expect(err).toBe(error);
        done();
      } catch (e) {
        done(e);
      }
    }

    process.on("uncaughtException", onUncaughtException);

    Q.reject(error).done();

    setTimeout(() => {
      process.removeListener("uncaughtException", onUncaughtException);
      if (caught === null) {
        done(new Error("Expected uncaught exception was not thrown"));
      }
    }, 100);
  });
});