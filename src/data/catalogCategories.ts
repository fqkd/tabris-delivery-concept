import type { ProductCategoryId } from '../types'

export type CatalogCategory = {
  id: ProductCategoryId
  label: string
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: 'own-production',
    label: 'Наше производство',
  },
  {
    id: 'fruit-vegetables',
    label: 'Овощи и фрукты',
  },
  {
    id: 'dairy',
    label: 'Молочные продукты',
  },
  { id: 'cheese', label: 'Сыр' },
  {
    id: 'meat-poultry-eggs',
    label: 'Мясо, птица, яйцо',
  },
  {
    id: 'fish-delicacies',
    label: 'Рыба, деликатесы',
  },
  {
    id: 'meat-gastronomy',
    label: 'Мясная гастрономия',
  },
  {
    id: 'frozen-semi-finished',
    label: 'Заморозка, полуфабрикаты',
  },
  { id: 'drinks', label: 'Напитки' },
  { id: 'alcohol', label: 'Алкоголь' },
  {
    id: 'grocery-canned',
    label: 'Бакалея, консервация',
  },
  {
    id: 'snacks-dried-fruit-nuts',
    label: 'Снеки, сухофрукты, орехи',
  },
  {
    id: 'sweets-cookies-chocolate',
    label: 'Конфеты, печенье, шоколад',
  },
  {
    id: 'bread-snacks-dough',
    label: 'Хлебные снеки, тесто',
  },
  {
    id: 'kids',
    label: 'Товары для детей',
  },
  {
    id: 'healthy-food',
    label: 'Правильное питание',
  },
  {
    id: 'coffee-tea-cocoa',
    label: 'Кофе, Чай, Какао',
  },
  {
    id: 'household',
    label: 'Товары для дома',
  },
  {
    id: 'cosmetics-hygiene',
    label: 'Косметика гигиена',
  },
  {
    id: 'pets',
    label: 'Товары для животных',
  },
  {
    id: 'stationery',
    label: 'Канцтовары',
  },
]

export const getCategoryLabel = (categoryId: ProductCategoryId) =>
  catalogCategories.find((category) => category.id === categoryId)?.label ??
  'Каталог'
