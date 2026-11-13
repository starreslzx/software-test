import find from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/find.js"

describe("find sink", () => {
  it("should call the callback with the first matching value when only a test function is provided", (done) => {
    const values = [1, 2, 3, 4, 5]
    let i = 0

    const source = (abort: any, cb: any) => {
      if (abort) return cb(abort === true ? null : abort)
      if (i >= values.length) return cb(true)
      cb(null, values[i++])
    }

    const results: any[] = []
    const sink = find((d: number) => d > 2, (err: any, data: any) => {
      results.push([err, data])
    })

    sink(source)

    setTimeout(() => {
      expect(results).toEqual([[null, 3]])
      done()
    }, 10)
  })
})