import type { ProductCategoryId } from '../types'

export type CatalogCategory = {
  id: ProductCategoryId
  label: string
  shortLabel: string
}

export const catalogCategories: CatalogCategory[] = [
  { id: 'ready', label: 'Готовая еда', shortLabel: 'Готовое' },
  { id: 'salads', label: 'Салаты', shortLabel: 'Салаты' },
  { id: 'bakery', label: 'Выпечка и хлеб', shortLabel: 'Выпечка' },
  { id: 'desserts', label: 'Десерты', shortLabel: 'Десерты' },
  { id: 'cheese', label: 'Сыры', shortLabel: 'Сыры' },
  { id: 'fish', label: 'Рыба', shortLabel: 'Рыба' },
  { id: 'drinks', label: 'Напитки', shortLabel: 'Напитки' },
]

export const getCategoryLabel = (categoryId: ProductCategoryId) =>
  catalogCategories.find((category) => category.id === categoryId)?.label ??
  'Каталог'
