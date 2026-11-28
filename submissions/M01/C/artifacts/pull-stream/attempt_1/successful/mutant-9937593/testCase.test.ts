import drain from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/drain.js"

describe("drain sink", () => {
  it("propagates an error to the done callback when the source emits a non-true error and no done is supplied", () => {
    const error = new Error("source failed")

    // A source that emits an error immediately
    const source = (_end: any, cb: any) => {
      cb(error)
    }

    const sink = drain(null)

    // When no done callback is supplied and the source emits an error,
    // the original implementation should throw the error.
    expect(() => {
      sink(source)
    }).toThrow("source failed")
  })
})