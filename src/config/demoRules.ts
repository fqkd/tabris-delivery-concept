import type {
  CatalogFilters,
  DemoProfile,
  ProductCategoryId,
  SearchState,
} from '../types'

export const DEMO_RULES = {
  minimumOrder: 500,
  deliveryFee: 149,
  freeDeliveryFrom: 1500,
  assemblyTime: '60–90 минут',
  bonusBaseRate: 0.05,
  bonusFavoriteRate: 0.1,
  minimumCashPayment: 1,
  initialBonusBalance: 2480,
  maxCartQuantity: 99,
  commentMaxLength: 140,
} as const

export const defaultProfile: DemoProfile = {
  name: 'Алексей · демо-профиль',
  phone: '+7 ••• •••-42-18',
}

export const favoriteCategoryIds: ProductCategoryId[] = [
  'own-production',
  'cheese',
  'drinks',
]

export const defaultFilters: CatalogFilters = {
  availableOnly: false,
  saleOnly: false,
  ownProductionOnly: false,
  categoryId: 'all',
}

export const defaultSearchState: SearchState = {
  query: '',
  recentQueries: ['сырники', 'лосось'],
  filters: defaultFilters,
  sort: 'popular',
  scrollTop: 0,
}
