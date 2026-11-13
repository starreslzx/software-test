import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.done unhandled error", () => {
  it("invokes Q.onerror with the rejection reason when a done chain rejects", (done) => {
    const error = new Error("boom");
    let received: any = null;

    const previousOnError = (Q as any).onerror;
    (Q as any).onerror = (err: any) => {
      received = err;
    };

    Q.reject(error).done();

    setTimeout(() => {
      (Q as any).onerror = previousOnError;
      try {
        expect(received).toBe(error);
        done();
      } catch (e) {
        done(e);
      }
    }, 100);
  });
});