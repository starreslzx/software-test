declare const require: any;

export {};

function loadProp(): any {
  for (let depth = 5; depth <= 15; depth++) {
    const relative = "../".repeat(depth) + "subject_repositories/pull-stream/util/prop.js";
    try {
      return require(relative);
    } catch (e) {
      // Try the next directory level.
    }
  }
  throw new Error("Could not locate util/prop.js");
}

describe("prop", () => {
  test("returns a matching function when given a RegExp key", () => {
    const prop = loadProp();

    const accessor = prop(/hello (\w+)/);

    expect(typeof accessor).toBe("function");
    expect(accessor("say hello world")).toBe("hello world");
    expect(accessor("say goodbye")).toBe(null);
  });
});