import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull", () => {
  it("should not call a transform function more times than there are arguments", () => {
    let transformCalls = 0

    const source = (abort: any, cb: any) => {
      cb(true)
    }

    const transform = (read: any) => {
      transformCalls++
      return (abort: any, cb: any) => {
        read(abort, cb)
      }
    }

    const result = pull(source, transform)

    expect(transformCalls).toBe(1)

    result(null, () => {})

    expect(transformCalls).toBe(1)
  })
})