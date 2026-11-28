import Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q rejection tracking", () => {
  it("removes a rejection from unhandled reasons once it is handled", async () => {
    Q.resetUnhandledRejections();

    const error = new Error("boom");
    const rejected = Q.reject(error);

    // Attach a rejection handler; this should untrack the rejection.
    await rejected.then(undefined, () => undefined);

    // Give Q's nextTick queue a chance to flush any scheduled bookkeeping.
    await new Promise<void>((resolve) => Q.nextTick(resolve));

    expect(Q.getUnhandledReasons()).toEqual([]);
  });
});