import { createContext, useContext } from 'react'
import type {
  CatalogFilters,
  CatalogSort,
  CartAddition,
  CartState,
  DeliveryAddress,
  DemoProfile,
  OrderSnapshot,
  SearchState,
} from '../types'

export type ShopContextValue = {
  cart: CartState
  favoriteIds: string[]
  deliveryCity: string
  address: DeliveryAddress | null
  isAddressOpen: boolean
  cartCount: number
  search: SearchState
  profile: DemoProfile
  electronicReceipts: boolean
  bonusBalance: number
  orders: OrderSnapshot[]
  lastOrder: OrderSnapshot | null
  getOrder: (orderId: string) => OrderSnapshot | null
  setQuantity: (productId: string, quantity: number) => void
  addCartItems: (additions: CartAddition[]) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  openAddress: () => void
  closeAddress: () => void
  selectDeliveryCity: (city: string) => void
  confirmAddress: (address: DeliveryAddress) => void
  setSearchQuery: (query: string) => void
  addRecentQuery: (query: string) => void
  setSearchFilters: (filters: Partial<CatalogFilters>) => void
  setSearchSort: (sort: CatalogSort) => void
  setSearchScrollTop: (scrollTop: number) => void
  resetSearch: () => void
  setElectronicReceipts: (enabled: boolean) => void
  placeOrder: (order: OrderSnapshot) => void
  clearOrderedCart: (orderId: string) => void
}

export const ShopContext = createContext<ShopContextValue | null>(null)

export const useShop = () => {
  const context = useContext(ShopContext)

  if (!context) {
    throw new Error('useShop должен использоваться внутри ShopProvider')
  }

  return context
}
