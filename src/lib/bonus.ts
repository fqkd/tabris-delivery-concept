export type BonusCalculationLine = {
  amount: number
  minimumCashUnits: number
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

const calculateLineRedemptionCapacity = (
  line: BonusCalculationLine,
  minimumCashPaymentPerUnit: number,
) => {
  if (!line.redemptionEligible) return 0

  const amount = normalizeBonusAmount(line.amount)
  const units = Number.isFinite(line.minimumCashUnits)
    ? Math.max(0, line.minimumCashUnits)
    : 0
  const requiredCash = roundBonusAmount(
    normalizeBonusAmount(minimumCashPaymentPerUnit) * units,
  )

  return roundBonusAmount(Math.max(0, amount - requiredCash))
}

export const calculateMaximumBonusSpend = (
  lines: BonusCalculationLine[],
  availableBalance: number,
  minimumCashPaymentPerUnit = 1,
) => {
  const balance = normalizeBonusAmount(availableBalance)
  const redeemableAmount = roundBonusAmount(
    lines.reduce(
      (sum, line) =>
        sum +
        calculateLineRedemptionCapacity(
          line,
          minimumCashPaymentPerUnit,
        ),
      0,
    ),
  )

  return roundBonusAmount(
    Math.min(balance, redeemableAmount),
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
  minimumCashPaymentPerUnit = 1,
) => {
  const redemptionCapacities = lines.map((line) =>
    calculateLineRedemptionCapacity(line, minimumCashPaymentPerUnit),
  )
  const redeemableAmount = roundBonusAmount(
    redemptionCapacities.reduce((sum, capacity) => sum + capacity, 0),
  )
  const appliedSpend = Math.min(
    normalizeBonusAmount(bonusSpent),
    redeemableAmount,
  )

  const earned = lines.reduce((sum, line, index) => {
    if (!line.accrualEligible || line.amount <= 0 || line.accrualRate <= 0) {
      return sum
    }

    const allocatedSpend =
      line.redemptionEligible && redeemableAmount > 0
        ? appliedSpend *
          (redemptionCapacities[index] / redeemableAmount)
        : 0
    const cashPaidForLine = Math.max(0, line.amount - allocatedSpend)
    return sum + cashPaidForLine * line.accrualRate
  }, 0)

  return roundBonusAmount(earned)
}
