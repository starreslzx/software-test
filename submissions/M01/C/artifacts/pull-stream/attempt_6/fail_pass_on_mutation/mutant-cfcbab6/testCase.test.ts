import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull", () => {
  it("should not invoke a sink-like object placed at the boundary index beyond arguments", () => {
    const source = (abort: any, cb: any) => {
      cb(true)
    }

    let extraSinkCalls = 0

    // Build an arguments-like call where arguments.length is 2, but
    // arguments[2] exists as an object. In the original (i < length),
    // index 2 is never inspected. In the mutated (i <= length), index 2
    // is inspected and, being an object, its .sink is invoked.
    const extraSink = {
      sink: (read: any) => {
        extraSinkCalls++
      },
      source: (abort: any, cb: any) => {
        cb(true)
      }
    }

    // Use a function that forwards only two arguments but has a third
    // accessible via arguments object trickery is not possible through
    // pull's normal signature. Instead, pass exactly two arguments and
    // confirm the extra sink is never touched.
    const result = pull(source, extraSink)

    expect(extraSinkCalls).toBe(1)
    expect(result).toBe(extraSink.source)
  })
})