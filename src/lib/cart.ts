import { DEMO_RULES, favoriteCategoryIds } from '../config/demoRules.ts'
import { products } from '../data/products.ts'
import {
  calculateEarnedBonus,
  calculateMaximumBonusSpend,
  clampBonusSpend,
  type BonusCalculationLine,
} from './bonus.ts'
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

const productToBonusLine = (
  product: Product,
  quantity: number,
): BonusCalculationLine => ({
  amount: product.price * normalizeQuantity(quantity),
  minimumCashUnits: normalizeQuantity(quantity),
  accrualRate: favoriteCategoryIds.includes(product.categoryId)
    ? DEMO_RULES.bonusFavoriteRate
    : DEMO_RULES.bonusBaseRate,
  accrualEligible:
    !product.unavailable &&
    !isSaleProduct(product) &&
    !product.bonusAccrualExcluded,
  redemptionEligible: !product.bonusRedemptionExcluded,
})

const cartToBonusLines = (cart: CartState) =>
  getCartItems(cart).map(({ product, quantity }) =>
    productToBonusLine(product, quantity),
  )

export const calculateProductBonus = (product: Product, quantity = 1) => {
  return calculateEarnedBonus([productToBonusLine(product, quantity)])
}

export const calculateBonusEarned = (
  cart: CartState,
  bonusSpent = 0,
) => calculateEarnedBonus(cartToBonusLines(cart), bonusSpent)

export const calculateMaxBonusSpend = (
  cart: CartState,
  availableBalance: number,
) => {
  return calculateMaximumBonusSpend(
    cartToBonusLines(cart),
    availableBalance,
    DEMO_RULES.minimumCashPaymentPerUnit,
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
  const bonusSpent = clampBonusSpend(requestedBonusSpend, maxBonusSpend)

  return {
    listSubtotal,
    merchandiseSubtotal,
    productDiscount,
    deliveryFee,
    bonusSpent,
    payableTotal: merchandiseSubtotal + deliveryFee - bonusSpent,
    bonusEarned: calculateBonusEarned(cart, bonusSpent),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    minimumOrderReached: merchandiseSubtotal >= DEMO_RULES.minimumOrder,
  }
}
