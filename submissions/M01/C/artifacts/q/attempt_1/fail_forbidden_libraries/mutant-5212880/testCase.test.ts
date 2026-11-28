import { describe, it, expect } from "@jest/globals";
import * as Q from "../../../../../../../../../../../subject_repositories/q/q.js";

describe("Q.done", () => {
  it("should forward fulfillment to the callback when given an object", async () => {
    const result = await new Promise<number>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("timed out")), 1000);
      Q.done(
        Q(42),
        (value: number) => {
          clearTimeout(timer);
          resolve(value);
        },
        undefined,
        undefined
      );
    });

    expect(result).toBe(42);
  });
});