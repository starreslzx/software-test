import { describe, it, expect } from '@jest/globals'
import { Matcher } from "../../../../../../../../../../../../subject_repositories/spacl-core/src/matcher.ts"

describe('Matcher path validation', () => {
  it('rejects a path specification that does not begin with a slash', () => {
    expect(() => new Matcher('foo')).toThrow('Path must begin with a slash')
  })
})