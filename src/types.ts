export type ProductCategoryId =
  | 'own-production'
  | 'fruit-vegetables'
  | 'dairy'
  | 'cheese'
  | 'meat-poultry-eggs'
  | 'fish-delicacies'
  | 'meat-gastronomy'
  | 'frozen-semi-finished'
  | 'drinks'
  | 'alcohol'
  | 'grocery-canned'
  | 'snacks-dried-fruit-nuts'
  | 'sweets-cookies-chocolate'
  | 'bread-snacks-dough'
  | 'kids'
  | 'healthy-food'
  | 'coffee-tea-cocoa'
  | 'household'
  | 'cosmetics-hygiene'
  | 'pets'
  | 'stationery'

export type Product = {
  id: string
  name: string
  weight: string
  price: number
  oldPrice?: number
  image: string
  description: string
  ingredients: string
  shelfLife: string
  ownProduction: boolean
  unavailable?: boolean
  ageRestricted?: boolean
  bonusAccrualExcluded?: boolean
  bonusRedemptionExcluded?: boolean
  categoryId: ProductCategoryId
  typeLabel: string
  keywords: string[]
  popularity: number
  subcategory: string
}

export type DeliveryAddress = {
  city: string
  street: string
  deliveryTime: string
}

export type CartState = Record<string, number>

export type CartAddition = {
  productId: string
  quantity: number
}

export type CatalogSort =
  | 'popular'
  | 'price-asc'
  | 'price-desc'
  | 'discount'

export type CatalogFilters = {
  availableOnly: boolean
  saleOnly: boolean
  ownProductionOnly: boolean
  categoryId: ProductCategoryId | 'all'
}

export type SearchState = {
  query: string
  recentQueries: string[]
  filters: CatalogFilters
  sort: CatalogSort
  scrollTop: number
}

export type DemoProfile = {
  name: string
  phone: string
}

export type DeliverySlot = {
  id: string
  dateKey: string
  dayLabel: string
  dateLabel: string
  timeLabel: string
  available: boolean
}

export type SubstitutionPolicy = 'similar' | 'contact' | 'remove'
export type PaymentMethod = 'card' | 'sbp'

export type OrderLineSnapshot = {
  productId: string
  name: string
  image: string
  weight: string
  unitPrice: number
  oldUnitPrice?: number
  quantity: number
}

export type OrderTotals = {
  listSubtotal: number
  merchandiseSubtotal: number
  productDiscount: number
  deliveryFee: number
  bonusSpent: number
  payableTotal: number
  bonusEarned: number
  itemCount: number
  minimumOrderReached: boolean
}

export type OrderStatus =
  | 'placed'
  | 'assembling'
  | 'courier'
  | 'delivering'
  | 'delivered'

export type OrderStatusEvent = {
  status: OrderStatus
  occurredAt: string
}

export type OrderEta = {
  minMinutes: number
  maxMinutes: number
}

export type OrderSnapshot = {
  id: string
  createdAt: string
  status: OrderStatus
  statusEvents: OrderStatusEvent[]
  eta?: OrderEta
  courierLocationUpdatedAt?: string
  address: DeliveryAddress
  deliverySlot: DeliverySlot
  recipient: DemoProfile
  substitutionPolicy: SubstitutionPolicy
  paymentMethod: PaymentMethod
  courierComment: string
  electronicReceipt: boolean
  lines: OrderLineSnapshot[]
  totals: OrderTotals
  bonusBalanceBefore: number
  bonusBalanceAfter: number
}

export type PersistedShopState = {
  cart: CartState
  favoriteIds: string[]
  deliveryCity: string
  address: DeliveryAddress | null
  search: SearchState
  profile: DemoProfile
  electronicReceipts: boolean
  bonusBalance: number
  orders: OrderSnapshot[]
  lastOrderId: string | null
  pendingCartClearOrderId: string | null
}

export type DinnerSetItem = {
  productId: string
  quantity: number
  role: string
  summaryLabel: string
}

export type DinnerSet = {
  id: string
  name: string
  description: string
  people: number
  servingTime: string
  items: DinnerSetItem[]
}
