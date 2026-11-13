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

    // Use a Proxy to simulate a sparse arguments object where length is 2
    // but index 2 is accessible. Since apply uses the array's length, we
    // need to trick it. Instead, call pull via a wrapper that uses
    // Function.prototype.call with a custom arguments-like object is not
    // possible. Use a real array of length 2 with a getter on index 2.
    const sparse: any = [source, extraSink]
    Object.defineProperty(sparse, "2", {
      get() {
        return extraSink
      },
      enumerable: true
    })

    pull.apply(null, sparse)

    expect(extraSinkCalls).toBe(1)
  })
})