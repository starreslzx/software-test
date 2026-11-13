import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull with a source object", () => {
  it("unwraps a source object that has a source function", () => {
    const values = [1, 2, 3]
    let index = 0
    const read = (_abort: any, cb: (end: any, data?: any) => void) => {
      if (index < values.length) {
        cb(null, values[index++])
      } else {
        cb(true)
      }
    }

    const sourceObject = { source: read }

    const collected: number[] = []
    const sink = pull(
      sourceObject,
      (r: any) => (end: any, data?: any) => {
        if (end) return
        collected.push(data)
        r(end, (e: any, d?: any) => {
          if (e) return
          collected.push(d)
        })
      }
    )

    // Drain synchronously by repeatedly calling the resulting source.
    let done = false
    const drain = () => {
      if (done) return
      sink(null, (end: any, data?: any) => {
        if (end === true) {
          done = true
          return
        }
        if (end) {
          done = true
          return
        }
        collected.push(data)
        drain()
      })
    }
    drain()

    expect(collected).toEqual([1, 2, 3])
  })
})