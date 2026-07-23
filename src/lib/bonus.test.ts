import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  calculateEarnedBonus,
  calculateMaximumBonusSpend,
  clampBonusSpend,
  roundBonusAmount,
  type BonusCalculationLine,
} from './bonus.ts'

const line = (
  amount: number,
  overrides: Partial<BonusCalculationLine> = {},
): BonusCalculationLine => ({
  amount,
  accrualRate: 0.05,
  accrualEligible: true,
  redemptionEligible: true,
  ...overrides,
})

describe('bonus calculations', () => {
  it('returns no available spend for a zero balance', () => {
    assert.equal(calculateMaximumBonusSpend([line(500)], 0), 0)
  })

  it('limits spend by a balance smaller than the order value', () => {
    assert.equal(calculateMaximumBonusSpend([line(500)], 125.45), 125.45)
  })

  it('keeps one ruble payable when the balance exceeds the order value', () => {
    assert.equal(calculateMaximumBonusSpend([line(500)], 5_000), 499)
  })

  it('allows redemption on a discounted item but does not accrue for it', () => {
    const saleLine = line(300, { accrualEligible: false })
    assert.equal(calculateMaximumBonusSpend([saleLine], 500), 299)
    assert.equal(calculateEarnedBonus([saleLine]), 0)
  })

  it('excludes delivery from redemption and accrual calculations', () => {
    const deliveryFee = 149
    const lines = [line(500)]
    const spent = calculateMaximumBonusSpend(lines, 5_000)
    const payableWithDelivery = 500 + deliveryFee - spent

    assert.equal(spent, 499)
    assert.equal(payableWithDelivery, 150)
    assert.equal(calculateEarnedBonus(lines, spent), 0.05)
  })

  it('rounds fractional accrual to hundredths', () => {
    assert.equal(calculateEarnedBonus([line(199.8)]), 9.99)
    assert.equal(roundBonusAmount(4.995), 5)
  })

  it('clamps an attempt to spend above the allowed amount', () => {
    assert.equal(clampBonusSpend(900, 249.75), 249.75)
  })

  it('reclamps a previously requested spend after the maximum changes', () => {
    const firstSpend = clampBonusSpend(400, 499)
    const changedSpend = clampBonusSpend(firstSpend, 120)

    assert.equal(firstSpend, 400)
    assert.equal(changedSpend, 120)
  })

  it('accrues only on the part paid in money after bonus redemption', () => {
    assert.equal(calculateEarnedBonus([line(500)], 200), 15)
  })

  it('allocates redemption proportionally in a mixed demo basket', () => {
    const lines = [
      line(200),
      line(200, { accrualEligible: false }),
    ]

    assert.equal(calculateEarnedBonus(lines, 200), 5)
  })

  it('uses the higher favorite-category rate without exceeding ten percent', () => {
    assert.equal(
      calculateEarnedBonus([line(250, { accrualRate: 0.1 })]),
      25,
    )
  })

  it('does not redeem against a restricted line', () => {
    const lines = [
      line(500, { redemptionEligible: false }),
      line(200),
    ]

    assert.equal(calculateMaximumBonusSpend(lines, 1_000), 200)
  })
})
