import { describe, it, expect } from "@jest/globals"
import { Matcher } from "../../../../../../../../../../../subject_repositories/spacl-core/src/matcher.ts"

describe("Matcher capture properties", () => {
  it("treats a colon-only segment as a literal, not a capture", () => {
    const matcher = Matcher.for("/a/:")
    expect(matcher.props).toEqual([])
    expect("/a/:".match(matcher)).not.toBeNull()
    expect("/a/x".match(matcher)).toBeNull()
  })
})