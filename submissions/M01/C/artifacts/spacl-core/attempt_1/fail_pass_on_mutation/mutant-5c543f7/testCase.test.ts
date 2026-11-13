import { describe, it, expect } from "@jest/globals"
import { Matcher } from "../../../../../../../../../../../subject_repositories/spacl-core/src/matcher.ts"

describe("Matcher capture properties", () => {
  it("treats a single-colon segment as a capture property", () => {
    const matcher = Matcher.for("/:a")
    expect(matcher.props).toEqual(["a"])
    expect("/x".match(matcher)).not.toBeNull()
    expect("/".match(matcher)).toBeNull()
  })
})