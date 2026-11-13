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

    // Clear any cached copies so the module under test is freshly evaluated.
    for (const key of Object.keys(require.cache)) {
      if (key.includes("graceful-fs") || key.includes("node-jsonfile")) {
        delete require.cache[key]
      }
    }

    const originalLoad = (Module as any)._load
    ;(Module as any)._load = function (request: string, parent: any, isMain: boolean) {
      if (request === "graceful-fs") {
        throw new Error("graceful-fs unavailable")
      }
      return originalLoad.call(this, request, parent, isMain)
    }

    try {
      const jsonfile = require(modulePath)

      // Original: catch sets _fs = require('fs') -> readFileSync works.
      // Mutant: catch is empty -> _fs undefined -> readFileSync throws TypeError.
      expect(() => jsonfile.readFileSync(filePath)).not.toThrow()
      expect(jsonfile.readFileSync(filePath)).toEqual({ hello: "world", n: 42 })
    } finally {
      ;(Module as any)._load = originalLoad
      nodeFs.rmSync(testDir, { recursive: true, force: true })
    }
  })
})