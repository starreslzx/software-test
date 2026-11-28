import find from "../../../../../../../../../../../../subject_repositories/pull-stream/sinks/find.js"

describe("find sink", () => {
  it("passes an error emitted by the source through to the find callback", (done) => {
    const boom = new Error("boom")
    let called = false

    const failingSource = (abort: any, cb: any) => {
      if (abort) return cb(abort)
      cb(boom)
    }

    find(
      () => false,
      (err: any, data: any) => {
        if (called) return
        called = true
        expect(err).toBe(boom)
        expect(data).toBeNull()
        done()
      }
    )(failingSource)
  })
})