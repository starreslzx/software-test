import find from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/find.js"

describe("find sink", () => {
  it("should call the callback with the first value when only a callback is provided", (done) => {
    const values = [10, 20, 30]
    let i = 0

    const source = (abort: any, cb: any) => {
      if (abort) return cb(abort === true ? null : abort)
      if (i >= values.length) return cb(true)
      cb(null, values[i++])
    }

    const results: any[] = []
    const sink = find((err: any, data: any) => {
      results.push([err, data])
    })

    sink(source)

    setTimeout(() => {
      expect(results).toEqual([[null, 10]])
      done()
    }, 10)
  })
})