export const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(value)

export const discountPercent = (price: number, oldPrice?: number) =>
  oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0
