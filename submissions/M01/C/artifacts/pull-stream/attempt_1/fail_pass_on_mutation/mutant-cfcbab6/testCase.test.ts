import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull", () => {
  it("should apply a single transform function exactly once and not invoke extra arguments", () => {
    const calls: number[] = []

    const source = (abort: any, cb: any) => {
      cb(null, 1)
      cb(true)
    }

    const transform = (read: any) => {
      return (abort: any, cb: any) => {
        calls.push(1)
        read(abort, cb)
      }
    }

    const sink = (read: any) => {
      read(null, (end: any, data: any) => {
        // consume
      })
    }

    const result = pull(source, transform, sink)

    expect(calls.length).toBe(1)
  })
})