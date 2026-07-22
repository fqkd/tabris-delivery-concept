import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartState, DeliveryAddress } from '../types'
import { ShopContext } from './ShopContext'

const CART_KEY = 'tabris-concept-cart'
const ADDRESS_KEY = 'tabris-concept-address'
const ADDRESS_CONFIRMED_KEY = 'tabris-concept-address-confirmed'

const defaultAddress: DeliveryAddress = {
  city: 'Краснодар',
  street: 'ул. Красная, 202',
  deliveryTime: 'Сегодня, 16:30–17:00',
}

const readCart = (): CartState => {
  try {
    return JSON.parse(sessionStorage.getItem(CART_KEY) ?? '{}') as CartState
  } catch {
    return {}
  }
}

const readAddress = (): DeliveryAddress => {
  try {
    return JSON.parse(
      sessionStorage.getItem(ADDRESS_KEY) ?? JSON.stringify(defaultAddress),
    ) as DeliveryAddress
  } catch {
    return defaultAddress
  }
}

type ShopProviderProps = {
  children: ReactNode
}

export function ShopProvider({ children }: ShopProviderProps) {
  const [cart, setCart] = useState<CartState>(readCart)
  const [address, setAddress] = useState<DeliveryAddress>(readAddress)
  const [isAddressOpen, setAddressOpen] = useState(
    () => sessionStorage.getItem(ADDRESS_CONFIRMED_KEY) !== 'true',
  )

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const value = useMemo(
    () => ({
      cart,
      address,
      isAddressOpen,
      cartCount: Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
      setQuantity: (productId: string, quantity: number) => {
        setCart((current) => {
          const next = { ...current }
          if (quantity <= 0) {
            delete next[productId]
          } else {
            next[productId] = quantity
          }
          return next
        })
      },
      removeFromCart: (productId: string) => {
        setCart((current) => {
          const next = { ...current }
          delete next[productId]
          return next
        })
      },
      openAddress: () => setAddressOpen(true),
      closeAddress: () => setAddressOpen(false),
      confirmAddress: (nextAddress: DeliveryAddress) => {
        setAddress(nextAddress)
        sessionStorage.setItem(ADDRESS_KEY, JSON.stringify(nextAddress))
        sessionStorage.setItem(ADDRESS_CONFIRMED_KEY, 'true')
        setAddressOpen(false)
      },
    }),
    [address, cart, isAddressOpen],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
