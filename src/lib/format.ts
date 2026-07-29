export const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(value)

export const discountPercent = (price: number, oldPrice?: number) =>
  oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0

export const formatProductCount = (count: number) => {
  const value = Math.max(0, Math.trunc(count))
  const lastTwo = value % 100
  const last = value % 10
  const noun =
    lastTwo >= 11 && lastTwo <= 14
      ? 'товаров'
      : last === 1
        ? 'товар'
        : last >= 2 && last <= 4
          ? 'товара'
          : 'товаров'
  return `${value} ${noun}`
}

export const formatBonusNoun = (count: number) => {
  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0

  if (!Number.isInteger(safeCount)) return 'бонуса'

  const value = Math.trunc(safeCount)
  const lastTwo = value % 100
  const last = value % 10
  const noun =
    lastTwo >= 11 && lastTwo <= 14
      ? 'бонусов'
      : last === 1
        ? 'бонус'
        : last >= 2 && last <= 4
          ? 'бонуса'
          : 'бонусов'

  return noun
}

export const formatBonusCount = (count: number) =>
  `${formatPrice(Number.isFinite(count) ? Math.max(0, count) : 0)} ${formatBonusNoun(count)}`
