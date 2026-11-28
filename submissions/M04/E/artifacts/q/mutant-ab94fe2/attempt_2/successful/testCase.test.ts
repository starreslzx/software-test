function loadQ(): any {
  const patterns = [
    "subject_repositories/q/q.js",
    "subject_repositories/q.js",
    "q/q.js",
    "q.js",
  ];
  const candidates: string[] = [];
  for (const pattern of patterns) {
    for (let depth = 8; depth <= 16; depth++) {
      candidates.push("../".repeat(depth) + pattern);
    }
  }

  let lastError: any;
  for (const candidate of candidates) {
    try {
      // @ts-ignore
      return require(candidate);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Could not load q.js");
}

describe("Q.done unhandled rejection", () => {
  it("notifies Q.onerror when a rejected promise is terminated with done", async () => {
    const Q = loadQ();

    const originalOnerror = Q.onerror;
    const onerror = jest.fn();
    Q.onerror = onerror;

    try {
      Q.stopUnhandledRejectionTracking();

      const error = new Error("boom");
      Q.reject(error).done();

      await new Promise<void>((resolve) => {
        Q.nextTick(() => {
          Q.nextTick(resolve);
        });
      });

      expect(onerror).toHaveBeenCalledTimes(1);
      expect(onerror).toHaveBeenCalledWith(error);
    } finally {
      Q.onerror = originalOnerror;
    }
  });
});