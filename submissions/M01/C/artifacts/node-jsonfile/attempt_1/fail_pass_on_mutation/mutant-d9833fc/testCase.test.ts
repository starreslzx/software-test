import * as path from "path"
import * as os from "os"
import * as nodeFs from "fs"

describe("jsonfile readFileSync fallback when graceful-fs is unavailable", () => {
  it("still reads JSON files using the built-in fs module when graceful-fs cannot be loaded", () => {
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

      const result = jsonfile.readFileSync(filePath)
      expect(result).toEqual({ hello: "world", n: 42 })

      const asyncResult = jsonfile.readFile(filePath)
      return expect(asyncResult).resolves.toEqual({ hello: "world", n: 42 })
    })

    nodeFs.rmSync(testDir, { recursive: true, force: true })
  })
})