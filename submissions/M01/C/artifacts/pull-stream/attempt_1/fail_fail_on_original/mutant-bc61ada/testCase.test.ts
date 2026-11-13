import reduce from "../../../../../../../../../../../subject_repositories/pull-stream/sinks/reduce.js"

describe("reduce sink", () => {
  it("calls back with null error when source ends immediately without initial accumulator", (done) => {
    const reducer = (acc: any, data: any) => (acc === null ? data : acc + data)

    const source = (end: any, cb: any) => {
      cb(true)
    }

    const sink = reduce(reducer, (err: any, acc: any) => {
      expect(err).toBeNull()
      expect(acc).toBeNull()
      done()
    })

    sink(source)
  })
})