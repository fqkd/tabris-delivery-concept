import type { ProductCategoryId } from '../types'

export type CatalogCategory = {
  id: ProductCategoryId
  label: string
  shortLabel: string
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: 'own-production',
    label: 'Наше производство',
    shortLabel: 'Наше производство',
  },
  {
    id: 'fruit-vegetables',
    label: 'Овощи и фрукты',
    shortLabel: 'Овощи и фрукты',
  },
  {
    id: 'dairy',
    label: 'Молочные продукты',
    shortLabel: 'Молочные',
  },
  { id: 'cheese', label: 'Сыр', shortLabel: 'Сыр' },
  {
    id: 'meat-poultry-eggs',
    label: 'Мясо, птица, яйцо',
    shortLabel: 'Мясо и птица',
  },
  {
    id: 'fish-delicacies',
    label: 'Рыба, деликатесы',
    shortLabel: 'Рыба',
  },
  {
    id: 'meat-gastronomy',
    label: 'Мясная гастрономия',
    shortLabel: 'Гастрономия',
  },
  {
    id: 'frozen-semi-finished',
    label: 'Заморозка, полуфабрикаты',
    shortLabel: 'Заморозка',
  },
  { id: 'drinks', label: 'Напитки', shortLabel: 'Напитки' },
  { id: 'alcohol', label: 'Алкоголь', shortLabel: 'Алкоголь' },
  {
    id: 'grocery-canned',
    label: 'Бакалея, консервация',
    shortLabel: 'Бакалея',
  },
  {
    id: 'snacks-dried-fruit-nuts',
    label: 'Снеки, сухофрукты, орехи',
    shortLabel: 'Снеки и орехи',
  },
  {
    id: 'sweets-cookies-chocolate',
    label: 'Конфеты, печенье, шоколад',
    shortLabel: 'Сладости',
  },
  {
    id: 'bread-snacks-dough',
    label: 'Хлебные снеки, тесто',
    shortLabel: 'Хлеб и тесто',
  },
  {
    id: 'kids',
    label: 'Товары для детей',
    shortLabel: 'Для детей',
  },
  {
    id: 'healthy-food',
    label: 'Правильное питание',
    shortLabel: 'Правильное питание',
  },
  {
    id: 'coffee-tea-cocoa',
    label: 'Кофе, Чай, Какао',
    shortLabel: 'Кофе и чай',
  },
  {
    id: 'household',
    label: 'Товары для дома',
    shortLabel: 'Для дома',
  },
  {
    id: 'cosmetics-hygiene',
    label: 'Косметика гигиена',
    shortLabel: 'Красота и гигиена',
  },
  {
    id: 'pets',
    label: 'Товары для животных',
    shortLabel: 'Для животных',
  },
  {
    id: 'stationery',
    label: 'Канцтовары',
    shortLabel: 'Канцтовары',
  },
]

export const getCategoryLabel = (categoryId: ProductCategoryId) =>
  catalogCategories.find((category) => category.id === categoryId)?.label ??
  'Каталог'
