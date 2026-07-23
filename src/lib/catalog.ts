import {
  catalogCategories,
  getCategoryLabel,
} from '../data/catalogCategories'
import { discountPercent } from './format'
import type {
  CatalogFilters,
  CatalogSort,
  Product,
  ProductCategoryId,
} from '../types'

export const normalizeSearchText = (value: string) =>
  value
    .toLocaleLowerCase('ru-RU')
    .replaceAll('ё', 'е')
    .replace(/\s+/g, ' ')
    .trim()

export const matchesSearch = (product: Product, query: string) => {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return true

  const haystack = normalizeSearchText(
    [
      product.name,
      product.typeLabel,
      product.description,
      getCategoryLabel(product.categoryId),
      product.ownProduction ? 'наше производство собственное производство' : '',
      ...product.keywords,
    ].join(' '),
  )

  return normalizedQuery
    .split(' ')
    .every((term) => haystack.includes(term))
}

export const filterProducts = (
  catalog: Product[],
  query: string,
  filters: CatalogFilters,
) =>
  catalog.filter((product) => {
    if (!matchesSearch(product, query)) return false
    if (filters.availableOnly && product.unavailable) return false
    if (filters.saleOnly && !product.oldPrice) return false
    if (filters.ownProductionOnly && !product.ownProduction) return false
    if (
      filters.categoryId !== 'all' &&
      product.categoryId !== filters.categoryId
    ) {
      return false
    }
    return true
  })

export const sortProducts = (catalog: Product[], sort: CatalogSort) => {
  const sorted = [...catalog]

  sorted.sort((first, second) => {
    if (sort === 'price-asc') return first.price - second.price
    if (sort === 'price-desc') return second.price - first.price
    if (sort === 'discount') {
      return (
        discountPercent(second.price, second.oldPrice) -
        discountPercent(first.price, first.oldPrice)
      )
    }
    return second.popularity - first.popularity
  })

  return sorted
}

export const getAppliedFilterLabels = (filters: CatalogFilters) => {
  const labels: string[] = []
  if (filters.availableOnly) labels.push('В наличии')
  if (filters.saleOnly) labels.push('Со скидкой')
  if (filters.ownProductionOnly) labels.push('Наше производство')
  if (filters.categoryId !== 'all') {
    labels.push(getCategoryLabel(filters.categoryId))
  }
  return labels
}

export const isProductCategoryId = (
  value: string,
): value is ProductCategoryId =>
  catalogCategories.some((category) => category.id === value)
