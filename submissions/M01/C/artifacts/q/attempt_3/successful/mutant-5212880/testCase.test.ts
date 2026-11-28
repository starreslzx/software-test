import Q = require("../../../../../../../../../../../subject_repositories/q/q.js");

describe("Q.done", () => {
  it("should invoke the fulfillment callback when given a promise and a callback", (done) => {
    Q.done(
      Q(42),
      (value: number) => {
        expect(value).toBe(42);
        done();
      }
    );
  });
});