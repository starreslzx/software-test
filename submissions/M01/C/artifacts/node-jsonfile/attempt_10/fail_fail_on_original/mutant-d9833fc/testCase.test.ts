import * as path from "path"
import * as os from "os"
import * as nodeFs from "fs"
import * as Module from "module"

describe("jsonfile falls back to built-in fs when graceful-fs cannot be loaded", () => {
  it("reads JSON files using the built-in fs module after graceful-fs import throws", () => {
    const testDir = nodeFs.mkdtempSync(path.join(os.tmpdir(), "jsonfile-mutant-"))
    const filePath = path.join(testDir, "data.json")
    nodeFs.writeFileSync(filePath, JSON.stringify({ hello: "world", n: 42 }), "utf8")

    const modulePath = "../../../../../../../../../../../subject_repositories/node-jsonfile/index.js"

    jest.resetModules()

    const originalLoad = (Module as any)._load
    ;(Module as any)._load = function (request: string, parent: any, isMain: boolean) {
      if (request === "graceful-fs") {
        throw new Error("graceful-fs unavailable")
      }
      return originalLoad.call(this, request, parent, isMain)
    }

    try {
      const jsonfile = require(modulePath)

      // Original code: catch block sets _fs = require('fs'), so readFileSync works.
      // Mutated code: catch block is empty, _fs stays undefined, and readFileSync
      // throws a TypeError because fs is undefined.
      expect(() => jsonfile.readFileSync(filePath)).not.toThrow()
      expect(jsonfile.readFileSync(filePath)).toEqual({ hello: "world", n: 42 })
    } finally {
      ;(Module as any)._load = originalLoad
      nodeFs.rmSync(testDir, { recursive: true, force: true })
    }
  })
})