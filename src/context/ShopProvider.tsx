import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { getCartItemCount } from '../lib/cart'
import { getInitialAppLocation } from '../lib/deployment'
import { loadPersistedState, savePersistedState } from '../lib/storage'
import {
  DEMO_TRACKING_ORDER_ID,
  demoTrackingOrder,
} from '../data/demoOrder'
import { ShopContext } from './ShopContext'
import { shopReducer } from './shopReducer'
import type {
  CartAddition,
  CatalogFilters,
  CatalogSort,
  DeliveryAddress,
  OrderSnapshot,
} from '../types'

type ShopProviderProps = {
  children: ReactNode
}

export function ShopProvider({ children }: ShopProviderProps) {
  const initialLocation = getInitialAppLocation()
  const [state, dispatch] = useReducer(
    shopReducer,
    undefined,
    loadPersistedState,
  )
  const [isAddressOpen, setAddressOpen] = useState(
    () =>
      state.address === null &&
      initialLocation.pathname === '/' &&
      new URLSearchParams(initialLocation.search).get('source') !== 'case',
  )

  useEffect(() => {
    savePersistedState(state)
  }, [state])

  const setSearchScrollTop = useCallback(
    (scrollTop: number) =>
      dispatch({ type: 'SET_SEARCH_SCROLL', scrollTop }),
    [],
  )

  const value = useMemo(
    () => {
      const lastOrder =
        state.orders.find((order) => order.id === state.lastOrderId) ?? null

      return {
        ...state,
        lastOrder,
        isAddressOpen,
        cartCount: getCartItemCount(state.cart),
        getOrder: (orderId: string) =>
          state.orders.find((order) => order.id === orderId) ??
          (orderId === DEMO_TRACKING_ORDER_ID ? demoTrackingOrder : null),
        setQuantity: (productId: string, quantity: number) =>
          dispatch({ type: 'SET_QUANTITY', productId, quantity }),
        addCartItems: (additions: CartAddition[]) =>
          dispatch({ type: 'ADD_CART_ITEMS', additions }),
        removeFromCart: (productId: string) =>
          dispatch({ type: 'REMOVE_CART_ITEM', productId }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleFavorite: (productId: string) =>
          dispatch({ type: 'TOGGLE_FAVORITE', productId }),
        isFavorite: (productId: string) => state.favoriteIds.includes(productId),
        openAddress: () => setAddressOpen(true),
        closeAddress: () => setAddressOpen(false),
        selectDeliveryCity: (city: string) =>
          dispatch({ type: 'SELECT_DELIVERY_CITY', city }),
        confirmAddress: (address: DeliveryAddress) => {
          dispatch({ type: 'CONFIRM_ADDRESS', address })
          setAddressOpen(false)
        },
        setSearchQuery: (query: string) =>
          dispatch({ type: 'SET_SEARCH_QUERY', query }),
        addRecentQuery: (query: string) =>
          dispatch({ type: 'ADD_RECENT_QUERY', query }),
        setSearchFilters: (filters: Partial<CatalogFilters>) =>
          dispatch({ type: 'SET_SEARCH_FILTERS', filters }),
        setSearchSort: (sort: CatalogSort) =>
          dispatch({ type: 'SET_SEARCH_SORT', sort }),
        setSearchScrollTop,
        resetSearch: () => dispatch({ type: 'RESET_SEARCH' }),
        setElectronicReceipts: (enabled: boolean) =>
          dispatch({ type: 'SET_ELECTRONIC_RECEIPTS', enabled }),
        placeOrder: (order: OrderSnapshot) =>
          dispatch({ type: 'SAVE_ORDER', order }),
        clearOrderedCart: (orderId: string) =>
          dispatch({ type: 'CLEAR_ORDERED_CART', orderId }),
      }
    },
    [isAddressOpen, setSearchScrollTop, state],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
