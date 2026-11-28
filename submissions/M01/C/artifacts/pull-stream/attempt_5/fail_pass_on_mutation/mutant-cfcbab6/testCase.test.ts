import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull", () => {
  it("should not read beyond the declared arguments length", () => {
    const source = (abort: any, cb: any) => {
      cb(true)
    }

    const transform = (read: any) => {
      return (abort: any, cb: any) => {
        read(abort, cb)
      }
    }

    // Invoke pull with exactly two arguments. The loop bound must be
    // i < length (length === 2), so index 2 is never touched.
    // To detect the off-by-one, we exploit that reading arguments[length]
    // in the mutated version picks up an extra value. We can't pass extra
    // args without changing length, so instead we verify the returned
    // stream behaves correctly and that no extra transform is applied.
    //
    // Use a Proxy-like observable: pass a sink object as the last argument
    // and confirm it is applied exactly once, and that the resulting source
    // is the sink's source (not the transform's output).
    const sink = {
      sink: (read: any) => {
        // consume nothing
      },
      source: (abort: any, cb: any) => {
        cb(true)
      }
    }

    const result = pull(source, transform, sink)

    expect(result).toBe(sink.source)
  })
})