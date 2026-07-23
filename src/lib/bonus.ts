export type BonusCalculationLine = {
  amount: number
  accrualRate: number
  accrualEligible: boolean
  redemptionEligible: boolean
}

export const roundBonusAmount = (value: number) => {
  if (!Number.isFinite(value)) return 0
  return Math.round((Math.max(0, value) + Number.EPSILON) * 100) / 100
}

export const normalizeBonusAmount = (value: number) =>
  roundBonusAmount(Number.isFinite(value) ? value : 0)

export const calculateMerchandiseAmount = (
  lines: BonusCalculationLine[],
) =>
  roundBonusAmount(
    lines.reduce((sum, line) => sum + Math.max(0, line.amount), 0),
  )

export const calculateRedeemableAmount = (
  lines: BonusCalculationLine[],
) =>
  roundBonusAmount(
    lines.reduce(
      (sum, line) =>
        sum + (line.redemptionEligible ? Math.max(0, line.amount) : 0),
      0,
    ),
  )

export const calculateMaximumBonusSpend = (
  lines: BonusCalculationLine[],
  availableBalance: number,
  minimumCashPayment = 1,
) => {
  const merchandiseAmount = calculateMerchandiseAmount(lines)
  const redeemableAmount = calculateRedeemableAmount(lines)
  const balance = normalizeBonusAmount(availableBalance)
  const requiredCash = normalizeBonusAmount(minimumCashPayment)

  return roundBonusAmount(
    Math.min(
      balance,
      redeemableAmount,
      Math.max(0, merchandiseAmount - requiredCash),
    ),
  )
}

export const clampBonusSpend = (
  requestedSpend: number,
  maximumSpend: number,
) =>
  roundBonusAmount(
    Math.min(
      normalizeBonusAmount(requestedSpend),
      normalizeBonusAmount(maximumSpend),
    ),
  )

export const calculateEarnedBonus = (
  lines: BonusCalculationLine[],
  bonusSpent = 0,
) => {
  const redeemableAmount = calculateRedeemableAmount(lines)
  const appliedSpend = Math.min(
    normalizeBonusAmount(bonusSpent),
    redeemableAmount,
  )

  const earned = lines.reduce((sum, line) => {
    if (!line.accrualEligible || line.amount <= 0 || line.accrualRate <= 0) {
      return sum
    }

    const allocatedSpend =
      line.redemptionEligible && redeemableAmount > 0
        ? appliedSpend * (line.amount / redeemableAmount)
        : 0
    const cashPaidForLine = Math.max(0, line.amount - allocatedSpend)
    return sum + cashPaidForLine * line.accrualRate
  }, 0)

  return roundBonusAmount(earned)
}
