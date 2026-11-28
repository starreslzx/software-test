import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull partial application", () => {
  it("does not treat a non-function first argument as a partial sink", () => {
    // A source object with a `source` function and a `sink` function.
    // When passed as the first argument to pull, the original code
    // should just return the source (via the normal pipeline logic),
    // not create a partial sink function.
    const sourceFn = jest.fn((abort: any, cb: any) => {
      cb(null, "value")
    })

    const sourceObj = {
      source: sourceFn,
      sink: jest.fn()
    }

    const result = pull(sourceObj as any)

    // In the original code, since a is an object (not a function),
    // the partial-sink branch is skipped, and pull returns read,
    // which is sourceObj.source.
    expect(typeof result).toBe("function")
    expect(result).toBe(sourceFn)

    // The mutated code treats any value with .length === 1 as a partial sink.
    // sourceObj.length is undefined, so this specific case wouldn't trigger...
    // Use an object with length === 1 to distinguish.
    const sourceObjWithLength = {
      length: 1,
      source: sourceFn,
      sink: jest.fn()
    }

    const result2 = pull(sourceObjWithLength as any)

    // Original: returns sourceFn (a function).
    // Mutated: returns a partial sink function (also a function), but
    // calling it with a read function should behave differently.
    // In the original, result2 is sourceFn itself.
    expect(result2).toBe(sourceFn)
  })
})