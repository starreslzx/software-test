import find from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/find.js"

describe("find sink", () => {
  it("should call the callback with the first matching value when only a test function is provided", (done) => {
    const source = (abort: any, cb: any) => {
      let i = 0
      const values = [1, 2, 3, 4, 5]
      return function next(end: any, dataCb: any) {
        if (end) return cb(end === true ? null : end)
        if (i >= values.length) return cb(true)
        dataCb(null, values[i++])
      }
    }

    const results: any[] = []
    const sink = find((d: number) => d > 2, (err: any, data: any) => {
      results.push([err, data])
    })

    sink(source)(null, (end: any) => {
      expect(results).toEqual([[null, 3]])
      done()
    })
  })
})