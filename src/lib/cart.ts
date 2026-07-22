import { DEMO_RULES, favoriteCategoryIds } from '../config/demoRules'
import { products } from '../data/products'
import type { CartAddition, CartState, OrderTotals, Product } from '../types'

export type CartItem = {
  product: Product
  quantity: number
}

export const normalizeQuantity = (quantity: number) => {
  if (!Number.isFinite(quantity)) return 0
  return Math.max(
    0,
    Math.min(DEMO_RULES.maxCartQuantity, Math.trunc(quantity)),
  )
}

export const getCartItems = (cart: CartState): CartItem[] =>
  products
    .map((product) => ({
      product,
      quantity: normalizeQuantity(cart[product.id] ?? 0),
    }))
    .filter((item) => item.quantity > 0)

export const getCartItemCount = (cart: CartState) =>
  Object.values(cart).reduce(
    (sum, quantity) => sum + normalizeQuantity(quantity),
    0,
  )

export const mergeCartAdditions = (
  cart: CartState,
  additions: CartAddition[],
) => {
  const next = { ...cart }

  additions.forEach(({ productId, quantity }) => {
    const current = normalizeQuantity(next[productId] ?? 0)
    const merged = normalizeQuantity(current + quantity)
    if (merged > 0) next[productId] = merged
  })

  return next
}

export const isSaleProduct = (product: Product) =>
  typeof product.oldPrice === 'number' && product.oldPrice > product.price

export const calculateProductBonus = (product: Product, quantity = 1) => {
  if (isSaleProduct(product)) return 0

  const rate = favoriteCategoryIds.includes(product.categoryId)
    ? DEMO_RULES.bonusFavoriteRate
    : DEMO_RULES.bonusBaseRate

  return Math.floor(product.price * normalizeQuantity(quantity) * rate)
}

export const calculateBonusEarned = (cart: CartState) =>
  getCartItems(cart).reduce(
    (sum, item) =>
      sum + calculateProductBonus(item.product, item.quantity),
    0,
  )

export const calculateMaxBonusSpend = (
  cart: CartState,
  availableBalance: number,
) => {
  const items = getCartItems(cart)
  const merchandiseSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const requiredCash = items.reduce((sum, item) => sum + item.quantity, 0)

  return Math.max(
    0,
    Math.min(
      Math.floor(Math.max(0, availableBalance)),
      Math.floor(merchandiseSubtotal - requiredCash),
    ),
  )
}

export const calculateOrderTotals = (
  cart: CartState,
  requestedBonusSpend = 0,
  availableBonusBalance = 0,
): OrderTotals => {
  const items = getCartItems(cart)
  const listSubtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.oldPrice ?? item.product.price) * item.quantity,
    0,
  )
  const merchandiseSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const productDiscount = listSubtotal - merchandiseSubtotal
  const deliveryFee =
    merchandiseSubtotal === 0 ||
    merchandiseSubtotal >= DEMO_RULES.freeDeliveryFrom
      ? 0
      : DEMO_RULES.deliveryFee
  const maxBonusSpend = calculateMaxBonusSpend(cart, availableBonusBalance)
  const bonusSpent = Math.max(
    0,
    Math.min(maxBonusSpend, Math.floor(requestedBonusSpend)),
  )

  return {
    listSubtotal,
    merchandiseSubtotal,
    productDiscount,
    deliveryFee,
    bonusSpent,
    payableTotal: merchandiseSubtotal + deliveryFee - bonusSpent,
    bonusEarned: calculateBonusEarned(cart),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    minimumOrderReached: merchandiseSubtotal >= DEMO_RULES.minimumOrder,
  }
}
