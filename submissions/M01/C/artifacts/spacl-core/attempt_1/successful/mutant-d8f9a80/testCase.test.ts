import { describe, it, expect } from '@jest/globals'
import { Matcher } from '../../../../../../../../../../../subject_repositories/spacl-core/src/matcher.ts'

describe('Matcher', () => {
  it('throws an error with a descriptive message when the path does not begin with a slash', () => {
    expect(() => new Matcher('foo/bar')).toThrow('Path must begin with a slash')
  })
})