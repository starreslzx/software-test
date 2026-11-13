import { describe, it, expect } from "@jest/globals"
import { Matcher } from "../../../../../../../../../../../subject_repositories/spacl-core/src/matcher.ts"

describe("Matcher capture properties", () => {
  it("treats a colon-prefixed segment as a capture property", () => {
    const matcher = Matcher.for("/:ab")
    expect(matcher.props).toEqual(["ab"])
    expect("/xy".match(matcher)).not.toBeNull()
    expect("/:ab".match(matcher)).toBeNull()
  })
})