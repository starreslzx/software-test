const Q: any = require("../../../../../../../../../../../../subject_repositories/q/q.js");

describe("unhandled rejection tracking", () => {
  it("records the stack trace of the reason for a rejected promise", () => {
    Q.resetUnhandledRejections();

    const reason = new Error("unique-unhandled-rejection-reason");
    Q.reject(reason);

    const reasons = Q.getUnhandledReasons();

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toBe(reason.stack);
  });
});