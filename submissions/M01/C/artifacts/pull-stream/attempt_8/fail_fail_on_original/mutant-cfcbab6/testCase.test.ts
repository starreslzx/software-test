import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull", () => {
  it("should not invoke a sink-like object at index equal to arguments.length", () => {
    const source = (abort: any, cb: any) => {
      cb(true)
    }

    let extraSinkCalls = 0

    const extraSink = {
      sink: (read: any) => {
        extraSinkCalls++
      },
      source: (abort: any, cb: any) => {
        cb(true)
      }
    }

    // Build a sparse array whose length is 2 but which has a value at
    // index 2. When applied via .apply, arguments.length becomes 2, so
    // the original loop (i < length) never inspects index 2. The mutated
    // loop (i <= length) inspects index 2 and, since it is an object,
    // invokes its .sink.
    const sparse: any = [source, extraSink]
    sparse[2] = extraSink

    const result = pull.apply(null, sparse)

    expect(extraSinkCalls).toBe(1)
    expect(result).toBe(extraSink.source)
  })
})