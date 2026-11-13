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

    // Call pull with exactly 3 arguments where the third (index 2) is a
    // sink object. Original: loop runs i=1,2 (i < 3), so extraSink at
    // index 2 is applied once. Mutated: loop runs i=1,2,3 (i <= 3), so
    // index 3 is undefined - not an object - so still no extra call.
    //
    // To hit the boundary, we need arguments[length] to be an object.
    // Use a wrapper that calls pull with a sparse arguments object where
    // arguments.length is 2 but arguments[2] is set.
    const fakeArgs: any = {
      0: source,
      1: extraSink,
      2: extraSink,
      length: 2
    }

    // pull reads arguments.length and arguments[i]; simulate by invoking
    // via Function.prototype.apply with a sparse array.
    const sparse = [source, extraSink]
    // eslint-disable-next-line no-extend-native
    ;(sparse as any).length = 2
    ;(sparse as any)[2] = extraSink

    const result = pull.apply(null, sparse as any)

    expect(extraSinkCalls).toBe(1)
    expect(result).toBe(extraSink.source)
  })
})