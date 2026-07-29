import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatBonusCount } from './format.ts'

describe('bonus wording', () => {
  it('uses the correct Russian form for common counts', () => {
    assert.equal(formatBonusCount(1), '1 бонус')
    assert.equal(formatBonusCount(2), '2 бонуса')
    assert.equal(formatBonusCount(5), '5 бонусов')
    assert.equal(formatBonusCount(1_663), '1 663 бонуса')
  })
})
