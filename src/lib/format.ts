export const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
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
