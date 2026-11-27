import * as fs from "fs"
import * as path from "path"

function loadPull(): any {
  let dir = __dirname
  for (;;) {
    const candidate = path.join(dir, "subject_repositories", "pull-stream", "pull.js")
    if (fs.existsSync(candidate)) {
      return require(path.relative(__dirname, candidate))
    }
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error("Could not locate pull.js")
}

const pull = loadPull()

describe("pull", () => {
  test("uses a stream object's source function as the readable source", () => {
    let sourceCalled = false
    const source = (abort: any, cb: any) => {
      sourceCalled = true
      if (abort) return cb(abort)
      cb(null, "hello")
    }
    const stream = { source, sink: () => {} }

    const read = pull(stream)

    expect(typeof read).toBe("function")

    let received: any
    read(null, (end: any, data: any) => {
      received = data
    })

    expect(sourceCalled).toBe(true)
    expect(received).toBe("hello")
  })
})