import { createContext, useContext } from 'react'
import type { CartState, DeliveryAddress } from '../types'

export type ShopContextValue = {
  cart: CartState
  address: DeliveryAddress
  isAddressOpen: boolean
  cartCount: number
  setQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  openAddress: () => void
  closeAddress: () => void
  confirmAddress: (address: DeliveryAddress) => void
}

export const ShopContext = createContext<ShopContextValue | null>(null)

export const useShop = () => {
  const context = useContext(ShopContext)

  if (!context) {
    throw new Error('useShop должен использоваться внутри ShopProvider')
  }

  return context
}
