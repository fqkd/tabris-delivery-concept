import { defaultFilters, isDeliveryCity } from '../config/demoRules.ts'
import { getProduct, productIds } from '../data/products.ts'
import { mergeCartAdditions, normalizeQuantity } from '../lib/cart.ts'
import { isAvailableForDelivery } from '../lib/deliveryAvailability.ts'
import type {
  CatalogFilters,
  CatalogSort,
  CartAddition,
  DeliveryAddress,
  OrderSnapshot,
  PersistedShopState,
} from '../types'

export type ShopAction =
  | { type: 'SET_QUANTITY'; productId: string; quantity: number }
  | { type: 'ADD_CART_ITEMS'; additions: CartAddition[] }
  | { type: 'REMOVE_CART_ITEM'; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; productId: string }
  | { type: 'SELECT_DELIVERY_CITY'; city: string }
  | { type: 'CONFIRM_ADDRESS'; address: DeliveryAddress }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'ADD_RECENT_QUERY'; query: string }
  | { type: 'SET_SEARCH_FILTERS'; filters: Partial<CatalogFilters> }
  | { type: 'SET_SEARCH_SORT'; sort: CatalogSort }
  | { type: 'SET_SEARCH_SCROLL'; scrollTop: number }
  | { type: 'RESET_SEARCH' }
  | { type: 'SET_ELECTRONIC_RECEIPTS'; enabled: boolean }
  | { type: 'SAVE_ORDER'; order: OrderSnapshot }
  | { type: 'CLEAR_ORDERED_CART'; orderId: string }

export const shopReducer = (
  state: PersistedShopState,
  action: ShopAction,
): PersistedShopState => {
  if (action.type === 'SET_QUANTITY') {
    const product = getProduct(action.productId)
    if (!product) return state
    const quantity = normalizeQuantity(action.quantity)
    const currentQuantity = normalizeQuantity(state.cart[action.productId] ?? 0)
    if (
      !isAvailableForDelivery(product, state.deliveryCity) &&
      quantity >= currentQuantity
    ) {
      return state
    }
    const cart = { ...state.cart }
    if (quantity === 0) delete cart[action.productId]
    else cart[action.productId] = quantity
    return { ...state, cart }
  }

  if (action.type === 'ADD_CART_ITEMS') {
    return {
      ...state,
      cart: mergeCartAdditions(
        state.cart,
        action.additions.filter((item) => {
          const product = getProduct(item.productId)
          return (
            product !== undefined &&
            isAvailableForDelivery(product, state.deliveryCity)
          )
        }),
      ),
    }
  }

  if (action.type === 'REMOVE_CART_ITEM') {
    const cart = { ...state.cart }
    delete cart[action.productId]
    return { ...state, cart }
  }

  if (action.type === 'CLEAR_CART') return { ...state, cart: {} }

  if (action.type === 'TOGGLE_FAVORITE') {
    if (!productIds.has(action.productId)) return state
    const isFavorite = state.favoriteIds.includes(action.productId)
    return {
      ...state,
      favoriteIds: isFavorite
        ? state.favoriteIds.filter((id) => id !== action.productId)
        : [...state.favoriteIds, action.productId],
    }
  }

  if (action.type === 'SELECT_DELIVERY_CITY') {
    if (!isDeliveryCity(action.city) || state.deliveryCity === action.city) {
      return state
    }
    return {
      ...state,
      deliveryCity: action.city,
      address: null,
    }
  }

  if (action.type === 'CONFIRM_ADDRESS') {
    if (!isDeliveryCity(action.address.city)) return state
    return {
      ...state,
      deliveryCity: action.address.city,
      address: action.address,
    }
  }

  if (action.type === 'SET_SEARCH_QUERY') {
    return {
      ...state,
      search: { ...state.search, query: action.query.slice(0, 80) },
    }
  }

  if (action.type === 'ADD_RECENT_QUERY') {
    const query = action.query.trim().slice(0, 60)
    if (!query) return state
    return {
      ...state,
      search: {
        ...state.search,
        recentQueries: [
          query,
          ...state.search.recentQueries.filter(
            (recent) => recent.toLocaleLowerCase('ru-RU') !== query.toLocaleLowerCase('ru-RU'),
          ),
        ].slice(0, 5),
      },
    }
  }

  if (action.type === 'SET_SEARCH_FILTERS') {
    return {
      ...state,
      search: {
        ...state.search,
        filters: { ...state.search.filters, ...action.filters },
      },
    }
  }

  if (action.type === 'SET_SEARCH_SORT') {
    return { ...state, search: { ...state.search, sort: action.sort } }
  }

  if (action.type === 'SET_SEARCH_SCROLL') {
    const scrollTop = Math.max(0, action.scrollTop)
    if (state.search.scrollTop === scrollTop) return state
    return {
      ...state,
      search: { ...state.search, scrollTop },
    }
  }

  if (action.type === 'RESET_SEARCH') {
    return {
      ...state,
      search: {
        ...state.search,
        query: '',
        filters: { ...defaultFilters },
        sort: 'popular',
        scrollTop: 0,
      },
    }
  }

  if (action.type === 'SET_ELECTRONIC_RECEIPTS') {
    return { ...state, electronicReceipts: action.enabled }
  }

  if (action.type === 'SAVE_ORDER') {
    if (state.orders.some((order) => order.id === action.order.id)) return state
    return {
      ...state,
      orders: [action.order, ...state.orders].slice(0, 20),
      lastOrderId: action.order.id,
      bonusBalance: action.order.bonusBalanceAfter,
      pendingCartClearOrderId: action.order.id,
    }
  }

  if (action.type === 'CLEAR_ORDERED_CART') {
    if (state.pendingCartClearOrderId !== action.orderId) {
      return state
    }
    return { ...state, cart: {}, pendingCartClearOrderId: null }
  }

  return state
}
