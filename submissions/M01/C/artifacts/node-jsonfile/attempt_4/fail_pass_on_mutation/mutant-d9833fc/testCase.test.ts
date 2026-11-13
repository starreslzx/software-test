import * as path from "path"
import * as os from "os"
import * as nodeFs from "fs"
import Module from "module"

describe("jsonfile falls back to built-in fs when graceful-fs fails to load", () => {
  it("reads JSON files using built-in fs after graceful-fs import throws", () => {
    const testDir = nodeFs.mkdtempSync(path.join(os.tmpdir(), "jsonfile-mutant-"))
    const filePath = path.join(testDir, "data.json")
    nodeFs.writeFileSync(filePath, JSON.stringify({ hello: "world", n: 42 }), "utf8")

    jest.resetModules()

    const modulePath = "../../../../../../../../../../../subject_repositories/node-jsonfile/index.js"

    const originalLoad = (Module as any)._load
    ;(Module as any)._load = function (request: string, parent: any, isMain: boolean) {
      if (request === "graceful-fs") {
        throw new Error("graceful-fs unavailable")
      }
      return originalLoad.call(this, request, parent, isMain)
    }

    try {
      const jsonfile = require(modulePath)
      const result = jsonfile.readFileSync(filePath)
      expect(result).toEqual({ hello: "world", n: 42 })
    } finally {
      ;(Module as any)._load = originalLoad
      nodeFs.rmSync(testDir, { recursive: true, force: true })
    }
  })
})