describe("Q.done", () => {
  it("invokes the fulfillment callback with the resolved value", async () => {
    const loadQ = () => {
      let lastError: unknown;
      for (let depth = 8; depth <= 16; depth++) {
        const modulePath = "../".repeat(depth) + "subject_repositories/q/q.js";
        try {
          return require(modulePath);
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError;
    };

    const Q = loadQ();

    const received: number[] = [];
    Q.done(Q(42), (value: number) => {
      received.push(value);
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 20));

    expect(received).toEqual([42]);
  });
});