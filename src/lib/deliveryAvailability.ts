import { products } from '../data/products.ts'
import type { CartState, Product } from '../types.ts'

export type DeliveryRestriction = {
  code: 'store-only' | 'unavailable'
  label: string
  explanation: string
}

export const getDeliveryRestriction = (
  product: Product,
  _city?: string,
): DeliveryRestriction | null => {
  if (product.categoryId === 'alcohol') {
    return {
      code: 'store-only',
      label: 'Только в магазине',
      explanation:
        'Алкоголь нельзя заказать с доставкой. Купить его можно только в магазине.',
    }
  }

  if (product.unavailable) {
    return {
      code: 'unavailable',
      label: 'Временно нет',
      explanation: 'Товар временно недоступен для заказа.',
    }
  }

  return null
}

export const isAvailableForDelivery = (
  product: Product,
  city?: string,
) => getDeliveryRestriction(product, city) === null

export const getUndeliverableCartItems = (
  cart: CartState,
  city?: string,
) =>
  products
    .map((product) => ({
      product,
      quantity: Math.max(0, Number(cart[product.id]) || 0),
      restriction: getDeliveryRestriction(product, city),
    }))
    .filter(
      (
        item,
      ): item is typeof item & {
        restriction: DeliveryRestriction
      } => item.quantity > 0 && item.restriction !== null,
    )

export const canCheckoutDeliveryCart = (
  cart: CartState,
  city?: string,
) => getUndeliverableCartItems(cart, city).length === 0
