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

    // pull(sourceObject) should return the unwrapped source function itself,
    // because a source object with a `source` function is unwrapped.
    const result = pull(sourceObject)

    expect(result).toBe(read)
  })
})