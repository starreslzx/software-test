import * as path from "path"
import * as os from "os"
import * as nodeFs from "fs"

jest.mock("graceful-fs", () => {
  throw new Error("graceful-fs unavailable")
})

describe("jsonfile falls back to built-in fs when graceful-fs fails to load", () => {
  it("reads JSON files using built-in fs after graceful-fs import throws", () => {
    const testDir = nodeFs.mkdtempSync(path.join(os.tmpdir(), "jsonfile-mutant-"))
    const filePath = path.join(testDir, "data.json")
    nodeFs.writeFileSync(filePath, JSON.stringify({ hello: "world", n: 42 }), "utf8")

    jest.resetModules()

    const modulePath = "../../../../../../../../../../../subject_repositories/node-jsonfile/index.js"

    let jsonfile: any
    jest.isolateModules(() => {
      jsonfile = require(modulePath)
    })

    // Original: catch block sets _fs = require('fs'), so readFileSync works.
    // Mutant: catch block is empty, _fs stays undefined, and readFileSync
    // throws a TypeError because fs is undefined.
    expect(() => jsonfile.readFileSync(filePath)).not.toThrow()
    expect(jsonfile.readFileSync(filePath)).toEqual({ hello: "world", n: 42 })

    nodeFs.rmSync(testDir, { recursive: true, force: true })
  })
})