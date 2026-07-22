import {
  DEMO_RULES,
  defaultAddress,
  defaultFilters,
  defaultProfile,
  defaultSearchState,
} from '../config/demoRules'
import { productIds } from '../data/products'
import { isProductCategoryId } from './catalog'
import { normalizeQuantity } from './cart'
import type {
  CatalogFilters,
  CatalogSort,
  CartState,
  DeliveryAddress,
  DeliverySlot,
  DemoProfile,
  OrderLineSnapshot,
  OrderSnapshot,
  OrderStatus,
  OrderTotals,
  PaymentMethod,
  PersistedShopState,
  SearchState,
  SubstitutionPolicy,
} from '../types'

const STORAGE_KEY = 'tabris-concept-state'
const STORAGE_VERSION = 2

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const safeString = (value: unknown, fallback: string, maxLength = 160) =>
  typeof value === 'string' && value.trim()
    ? value.slice(0, maxLength)
    : fallback

const safeNumber = (
  value: unknown,
  fallback: number,
  min = 0,
  max = 1_000_000,
) =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.max(min, Math.min(max, value))
    : fallback

export const createDefaultPersistedState = (): PersistedShopState => ({
  cart: {},
  favoriteIds: [],
  address: { ...defaultAddress },
  addressConfirmed: false,
  search: {
    ...defaultSearchState,
    recentQueries: [...defaultSearchState.recentQueries],
    filters: { ...defaultFilters },
  },
  profile: { ...defaultProfile },
  electronicReceipts: true,
  bonusBalance: DEMO_RULES.initialBonusBalance,
  lastOrder: null,
})

export const sanitizeCart = (value: unknown): CartState => {
  if (!isRecord(value)) return {}

  return Object.entries(value).reduce<CartState>((cart, [productId, raw]) => {
    if (!productIds.has(productId) || typeof raw !== 'number') return cart
    const quantity = normalizeQuantity(raw)
    if (quantity > 0) cart[productId] = quantity
    return cart
  }, {})
}

const sanitizeAddress = (value: unknown): DeliveryAddress => {
  if (!isRecord(value)) return { ...defaultAddress }
  return {
    city: safeString(value.city, defaultAddress.city, 50),
    street: safeString(value.street, defaultAddress.street, 100),
    deliveryTime: safeString(
      value.deliveryTime,
      defaultAddress.deliveryTime,
      60,
    ),
  }
}

const sanitizeProfile = (value: unknown): DemoProfile => {
  if (!isRecord(value)) return { ...defaultProfile }
  return {
    name: safeString(value.name, defaultProfile.name, 80),
    phone: safeString(value.phone, defaultProfile.phone, 40),
  }
}

const sortValues: CatalogSort[] = [
  'popular',
  'price-asc',
  'price-desc',
  'discount',
]

const sanitizeFilters = (value: unknown): CatalogFilters => {
  if (!isRecord(value)) return { ...defaultFilters }
  const category = typeof value.categoryId === 'string' ? value.categoryId : 'all'

  return {
    availableOnly: value.availableOnly === true,
    saleOnly: value.saleOnly === true,
    ownProductionOnly: value.ownProductionOnly === true,
    categoryId:
      category === 'all' || isProductCategoryId(category) ? category : 'all',
  }
}

const sanitizeSearch = (value: unknown): SearchState => {
  if (!isRecord(value)) {
    return {
      ...defaultSearchState,
      recentQueries: [...defaultSearchState.recentQueries],
      filters: { ...defaultFilters },
    }
  }

  const sort =
    typeof value.sort === 'string' &&
    sortValues.includes(value.sort as CatalogSort)
      ? (value.sort as CatalogSort)
      : 'popular'
  const recentQueries = Array.isArray(value.recentQueries)
    ? value.recentQueries
        .filter((query): query is string => typeof query === 'string')
        .map((query) => query.trim().slice(0, 60))
        .filter(Boolean)
        .slice(0, 5)
    : [...defaultSearchState.recentQueries]

  return {
    query: typeof value.query === 'string' ? value.query.slice(0, 80) : '',
    recentQueries,
    filters: sanitizeFilters(value.filters),
    sort,
    scrollTop: safeNumber(value.scrollTop, 0, 0, 100_000),
  }
}

const sanitizeDeliverySlot = (value: unknown): DeliverySlot | null => {
  if (!isRecord(value)) return null
  if (
    typeof value.id !== 'string' ||
    typeof value.dayLabel !== 'string' ||
    typeof value.dateLabel !== 'string' ||
    typeof value.timeLabel !== 'string'
  ) {
    return null
  }
  return {
    id: value.id.slice(0, 40),
    dayLabel: value.dayLabel.slice(0, 30),
    dateLabel: value.dateLabel.slice(0, 30),
    timeLabel: value.timeLabel.slice(0, 30),
    available: value.available !== false,
  }
}

const sanitizeTotals = (value: unknown): OrderTotals | null => {
  if (!isRecord(value)) return null
  const keys: (keyof Omit<
    OrderTotals,
    'minimumOrderReached'
  >)[] = [
    'listSubtotal',
    'merchandiseSubtotal',
    'productDiscount',
    'deliveryFee',
    'bonusSpent',
    'payableTotal',
    'bonusEarned',
    'itemCount',
  ]
  if (keys.some((key) => typeof value[key] !== 'number')) return null

  return {
    listSubtotal: safeNumber(value.listSubtotal, 0),
    merchandiseSubtotal: safeNumber(value.merchandiseSubtotal, 0),
    productDiscount: safeNumber(value.productDiscount, 0),
    deliveryFee: safeNumber(value.deliveryFee, 0),
    bonusSpent: safeNumber(value.bonusSpent, 0),
    payableTotal: safeNumber(value.payableTotal, 0),
    bonusEarned: safeNumber(value.bonusEarned, 0),
    itemCount: safeNumber(value.itemCount, 0, 0, 999),
    minimumOrderReached: value.minimumOrderReached === true,
  }
}

const sanitizeOrderLine = (value: unknown): OrderLineSnapshot | null => {
  if (!isRecord(value)) return null
  if (
    typeof value.productId !== 'string' ||
    typeof value.name !== 'string' ||
    typeof value.image !== 'string' ||
    typeof value.weight !== 'string' ||
    typeof value.unitPrice !== 'number' ||
    typeof value.quantity !== 'number'
  ) {
    return null
  }

  const quantity = normalizeQuantity(value.quantity)
  if (quantity === 0) return null

  return {
    productId: value.productId.slice(0, 80),
    name: value.name.slice(0, 140),
    image: value.image.slice(0, 180),
    weight: value.weight.slice(0, 40),
    unitPrice: safeNumber(value.unitPrice, 0),
    oldUnitPrice:
      typeof value.oldUnitPrice === 'number'
        ? safeNumber(value.oldUnitPrice, 0)
        : undefined,
    quantity,
  }
}

const orderStatuses: OrderStatus[] = [
  'placed',
  'assembling',
  'courier',
  'delivering',
  'delivered',
]
const substitutionPolicies: SubstitutionPolicy[] = [
  'similar',
  'contact',
  'remove',
]
const paymentMethods: PaymentMethod[] = ['card', 'sbp']

const sanitizeOrder = (value: unknown): OrderSnapshot | null => {
  if (!isRecord(value) || !Array.isArray(value.lines)) return null
  const deliverySlot = sanitizeDeliverySlot(value.deliverySlot)
  const totals = sanitizeTotals(value.totals)
  const lines = value.lines
    .map(sanitizeOrderLine)
    .filter((line): line is OrderLineSnapshot => Boolean(line))
  const status =
    typeof value.status === 'string' &&
    orderStatuses.includes(value.status as OrderStatus)
      ? (value.status as OrderStatus)
      : 'assembling'
  const substitutionPolicy =
    typeof value.substitutionPolicy === 'string' &&
    substitutionPolicies.includes(value.substitutionPolicy as SubstitutionPolicy)
      ? (value.substitutionPolicy as SubstitutionPolicy)
      : null
  const paymentMethod =
    typeof value.paymentMethod === 'string' &&
    paymentMethods.includes(value.paymentMethod as PaymentMethod)
      ? (value.paymentMethod as PaymentMethod)
      : null

  if (
    typeof value.id !== 'string' ||
    typeof value.createdAt !== 'string' ||
    Number.isNaN(Date.parse(value.createdAt)) ||
    !deliverySlot ||
    !totals ||
    !substitutionPolicy ||
    !paymentMethod ||
    lines.length === 0
  ) {
    return null
  }

  return {
    id: value.id.slice(0, 50),
    createdAt: value.createdAt,
    status,
    address: sanitizeAddress(value.address),
    deliverySlot,
    recipient: sanitizeProfile(value.recipient),
    substitutionPolicy,
    paymentMethod,
    courierComment:
      typeof value.courierComment === 'string'
        ? value.courierComment.slice(0, DEMO_RULES.commentMaxLength)
        : '',
    electronicReceipt: value.electronicReceipt !== false,
    lines,
    totals,
    bonusBalanceBefore: safeNumber(value.bonusBalanceBefore, 0),
    bonusBalanceAfter: safeNumber(value.bonusBalanceAfter, 0),
  }
}

const sanitizePersistedState = (value: unknown): PersistedShopState => {
  const defaults = createDefaultPersistedState()
  if (!isRecord(value)) return defaults

  const favoriteIds = Array.isArray(value.favoriteIds)
    ? [...new Set(
        value.favoriteIds.filter(
          (id): id is string => typeof id === 'string' && productIds.has(id),
        ),
      )]
    : []

  return {
    cart: sanitizeCart(value.cart),
    favoriteIds,
    address: sanitizeAddress(value.address),
    addressConfirmed: value.addressConfirmed === true,
    search: sanitizeSearch(value.search),
    profile: sanitizeProfile(value.profile),
    electronicReceipts: value.electronicReceipts !== false,
    bonusBalance: safeNumber(
      value.bonusBalance,
      DEMO_RULES.initialBonusBalance,
    ),
    lastOrder: sanitizeOrder(value.lastOrder),
  }
}

const parseJson = (value: string | null): unknown => {
  if (!value) return null
  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

const migrateLegacySession = (): PersistedShopState => {
  const defaults = createDefaultPersistedState()
  try {
    const legacyCart = parseJson(sessionStorage.getItem('tabris-concept-cart'))
    const legacyAddress = parseJson(
      sessionStorage.getItem('tabris-concept-address'),
    )
    return {
      ...defaults,
      cart: sanitizeCart(legacyCart),
      address: sanitizeAddress(legacyAddress),
      addressConfirmed:
        sessionStorage.getItem('tabris-concept-address-confirmed') === 'true',
    }
  } catch {
    return defaults
  }
}

export const loadPersistedState = (): PersistedShopState => {
  try {
    const parsed = parseJson(localStorage.getItem(STORAGE_KEY))
    if (isRecord(parsed) && parsed.version === STORAGE_VERSION) {
      return sanitizePersistedState(parsed.data)
    }
    return migrateLegacySession()
  } catch {
    return createDefaultPersistedState()
  }
}

export const savePersistedState = (state: PersistedShopState) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, data: state }),
    )
  } catch {
    // Storage can be unavailable in private mode. The in-memory app remains usable.
  }
}
