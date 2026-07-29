import { getProduct } from '../data/products.ts'
import type { CartAddition, DinnerSet } from '../types.ts'

export const getSelectedDinnerItems = (
  dinnerSet: DinnerSet,
  excludedProductIds: string[],
) =>
  dinnerSet.items
    .filter((item) => !excludedProductIds.includes(item.productId))
    .map((item) => ({ ...item, product: getProduct(item.productId) }))
    .filter((item) => Boolean(item.product))

export const describeDinnerSelection = (
  dinnerSet: DinnerSet,
  excludedProductIds: string[],
) => {
  const labels = getSelectedDinnerItems(dinnerSet, excludedProductIds).map(
    (item) => item.summaryLabel,
  )

  if (labels.length === 0) return 'В наборе пока нет товаров.'
  if (labels.length === 1) return `В наборе: ${labels[0]}.`

  return `В наборе: ${labels.slice(0, -1).join(', ')} и ${labels.at(-1)}.`
}

export const calculateDinnerTotal = (
  dinnerSet: DinnerSet,
  excludedProductIds: string[],
) =>
  getSelectedDinnerItems(dinnerSet, excludedProductIds).reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  )

export const dinnerItemsToCartAdditions = (
  dinnerSet: DinnerSet,
  excludedProductIds: string[],
): CartAddition[] =>
  getSelectedDinnerItems(dinnerSet, excludedProductIds).map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }))
