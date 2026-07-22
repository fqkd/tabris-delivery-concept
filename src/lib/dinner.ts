import { getProduct } from '../data/products'
import type { CartAddition, DinnerSet } from '../types'

export const getSelectedDinnerItems = (
  dinnerSet: DinnerSet,
  excludedProductIds: string[],
) =>
  dinnerSet.items
    .filter((item) => !excludedProductIds.includes(item.productId))
    .map((item) => ({ ...item, product: getProduct(item.productId) }))
    .filter((item) => Boolean(item.product))

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
