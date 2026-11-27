declare const require: any;

function loadPull(): any {
  for (const depth of [12, 11, 10, 9, 13]) {
    const candidate = "../".repeat(depth) + "subject_repositories/pull-stream/pull.js";
    try {
      return require(candidate);
    } catch (error) {
      // try the next candidate
    }
  }
  throw new Error("Could not locate pull.js");
}

const pull = loadPull();

describe("pull", () => {
  it("does not process arguments beyond the ones supplied", () => {
    const read = function read() {};
    const transformed = function transformed(_read: any) {
      return function replacement() {};
    };

    const hadOwnIndex = Object.prototype.hasOwnProperty.call(Object.prototype, "1");
    const previousIndex = (Object.prototype as any)[1];

    let result: any;
    try {
      (Object.prototype as any)[1] = transformed;
      result = pull(read);
    } finally {
      if (hadOwnIndex) {
        (Object.prototype as any)[1] = previousIndex;
      } else {
        delete (Object.prototype as any)[1];
      }
    }

    expect(result).toBe(read);
  });
});

export {};