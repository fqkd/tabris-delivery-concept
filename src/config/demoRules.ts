import type {
  CatalogFilters,
  DeliveryAddress,
  DeliverySlot,
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
  initialBonusBalance: 2480,
  maxCartQuantity: 99,
  commentMaxLength: 140,
} as const

export const defaultAddress: DeliveryAddress = {
  city: 'Краснодар',
  street: 'ул. Демонстрационная, 12',
  deliveryTime: 'Сегодня, 18:00–19:00',
}

export const defaultProfile: DemoProfile = {
  name: 'Алексей · демо-профиль',
  phone: '+7 ••• •••-42-18',
}

export const favoriteCategoryIds: ProductCategoryId[] = [
  'ready',
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

export const deliverySlots: DeliverySlot[] = [
  {
    id: 'today-17',
    dayLabel: 'Сегодня',
    dateLabel: '22 июля',
    timeLabel: '17:00–18:00',
    available: false,
  },
  {
    id: 'today-18',
    dayLabel: 'Сегодня',
    dateLabel: '22 июля',
    timeLabel: '18:00–19:00',
    available: true,
  },
  {
    id: 'today-19',
    dayLabel: 'Сегодня',
    dateLabel: '22 июля',
    timeLabel: '19:00–20:00',
    available: true,
  },
  {
    id: 'tomorrow-10',
    dayLabel: 'Завтра',
    dateLabel: '23 июля',
    timeLabel: '10:00–12:00',
    available: true,
  },
]
