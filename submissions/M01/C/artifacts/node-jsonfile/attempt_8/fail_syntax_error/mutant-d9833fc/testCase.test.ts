import * as path from "path"
import * as os from "os"
import * as nodeFs from "fs"

jest.mock("graceful-fs", () => {
  throw new Error("graceful-fs unavailable")
})

describe("...", () => {
  it("...", () => {
    ...
    jest.resetModules()
    const jsonfile = require(modulePath)
    expect(jsonfile.readFileSync(filePath)).toEqual(...)
  })
})