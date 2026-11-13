import pull from "../../../../../../../../../../../subject_repositories/pull-stream/pull.js"

describe("pull", () => {
  it("should not invoke transform functions beyond the provided arguments", () => {
    const calls: string[] = []

    const source = (abort: any, cb: any) => {
      cb(true)
    }

    const transform = (read: any) => {
      return (abort: any, cb: any) => {
        calls.push("transform")
        read(abort, cb)
      }
    }

    const result = pull(source, transform)

    expect(typeof result).toBe("function")
    expect(calls.length).toBe(0)

    result(null, () => {})

    expect(calls).toEqual(["transform"])
  })
})