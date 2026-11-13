import { describe, it, expect } from "@jest/globals"
import { Matcher } from "../../../../../../../../../../../subject_repositories/spacl-core/src/matcher.ts"

describe("Matcher capture properties", () => {
  it("treats a colon-only segment as a literal, not a capture", () => {
    const matcher = Matcher.for("/:")
    expect(matcher.props).toEqual([])
    expect("/:".match(matcher)).not.toBeNull()
    expect("/x".match(matcher)).toBeNull()
  })
})