import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull", () => {
  it("should not treat undefined trailing arguments as sinks when iterating", () => {
    const source = (abort: any, cb: any) => {
      cb(true)
    }

    const transform = (read: any) => {
      return (abort: any, cb: any) => {
        read(abort, cb)
      }
    }

    // Call pull with an explicit undefined as an extra argument beyond length.
    // In the original, the loop stops at i < length (length = 2), so the
    // undefined at index 2 is never inspected. In the mutated version,
    // i <= length means index 2 is inspected; undefined is neither a function
    // nor an object, so behavior should still match... unless we use a value
    // that IS an object at the boundary via arguments.length manipulation.
    //
    // Instead, use a sink object at the exact boundary index to detect the
    // off-by-one: place a sink-like object as the last real argument and
    // verify it is called exactly once.
    let sinkCalls = 0
    const sink = {
      sink: (read: any) => {
        sinkCalls++
        read(null, () => {})
      },
      source: (abort: any, cb: any) => {
        cb(true)
      }
    }

    pull(source, transform, sink)

    expect(sinkCalls).toBe(1)
  })
})