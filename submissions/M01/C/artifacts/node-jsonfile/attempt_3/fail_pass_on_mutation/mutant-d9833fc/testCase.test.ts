import * as path from "path"
import * as os from "os"
import * as nodeFs from "fs"

describe("jsonfile falls back to built-in fs when graceful-fs cannot be loaded", () => {
  it("uses the built-in fs module to read files after graceful-fs import fails", () => {
    const testDir = nodeFs.mkdtempSync(path.join(os.tmpdir(), "jsonfile-mutant-"))
    const filePath = path.join(testDir, "data.json")
    nodeFs.writeFileSync(filePath, JSON.stringify({ hello: "world", n: 42 }), "utf8")

    jest.resetModules()

    const modulePath = "../../../../../../../../../../../subject_repositories/node-jsonfile/index.js"

    jest.isolateModules(() => {
      jest.doMock("graceful-fs", () => {
        throw new Error("graceful-fs unavailable")
      })

      const jsonfile = require(modulePath)

      // Force the internal _fs to be used by not providing options.fs.
      // If the fallback to require('fs') is missing, _fs is undefined and
      // calling readFileSync on it throws a TypeError.
      const result = jsonfile.readFileSync(filePath)
      expect(result).toEqual({ hello: "world", n: 42 })
    })

    nodeFs.rmSync(testDir, { recursive: true, force: true })
  })
})