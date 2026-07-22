import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, type FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { useShop } from '../context/ShopContext'
import { catalogCategories } from '../data/catalogCategories'
import { products } from '../data/products'
import {
  filterProducts,
  getAppliedFilterLabels,
  isProductCategoryId,
  sortProducts,
} from '../lib/catalog'
import { formatProductCount } from '../lib/format'
import type { CatalogFilters, CatalogSort, ProductCategoryId } from '../types'

const popularCategoryIds: ProductCategoryId[] = [
  'ready',
  'salads',
  'bakery',
  'desserts',
]

const sortOptions: { value: CatalogSort; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'discount', label: 'По размеру скидки' },
]

export function CatalogPage() {
  const {
    search,
    setSearchQuery,
    addRecentQuery,
    setSearchFilters,
    setSearchSort,
    setSearchScrollTop,
    resetSearch,
  } = useShop()

  const visibleProducts = useMemo(
    () =>
      sortProducts(
        filterProducts(products, search.query, search.filters),
        search.sort,
      ),
    [search.filters, search.query, search.sort],
  )
  const appliedFilterLabels = getAppliedFilterLabels(search.filters)
  const hasSearchSettings =
    Boolean(search.query.trim()) ||
    appliedFilterLabels.length > 0 ||
    search.sort !== 'popular'

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = search.query.trim()
    if (query) addRecentQuery(query)
  }

  const chooseSuggestion = (query: string) => {
    setSearchQuery(query)
    addRecentQuery(query)
  }

  const chooseCategory = (categoryId: ProductCategoryId) => {
    setSearchQuery('')
    setSearchFilters({ categoryId })
  }

  const toggleFilter = (filter: keyof Pick<
    CatalogFilters,
    'availableOnly' | 'saleOnly' | 'ownProductionOnly'
  >) => {
    setSearchFilters({ [filter]: !search.filters[filter] })
  }

  return (
    <main className="screen screen--catalog has-bottom-nav">
      <PageHeader title="Каталог" backTo="/" />

      <div className="catalog-search-layout">
        <form className="catalog-search" role="search" onSubmit={submitSearch}>
          <Search aria-hidden="true" />
          <label className="visually-hidden" htmlFor="catalog-search-input">
            Поиск по каталогу
          </label>
          <input
            id="catalog-search-input"
            type="search"
            value={search.query}
            autoComplete="off"
            inputMode="search"
            placeholder="Найти продукты и готовые блюда"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {search.query && (
            <button
              type="button"
              className="catalog-search__clear"
              aria-label="Очистить поисковый запрос"
              onClick={() => setSearchQuery('')}
            >
              <X aria-hidden="true" />
            </button>
          )}
        </form>

        {!search.query.trim() && (
          <div className="catalog-discovery">
            {search.recentQueries.length > 0 && (
              <section aria-labelledby="recent-searches-title">
                <h2 id="recent-searches-title">Недавние запросы</h2>
                <div className="catalog-discovery__chips">
                  {search.recentQueries.map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => chooseSuggestion(query)}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="popular-categories-title">
              <h2 id="popular-categories-title">Популярные категории</h2>
              <div className="catalog-discovery__categories">
                {popularCategoryIds.map((categoryId) => {
                  const category = catalogCategories.find(
                    (item) => item.id === categoryId,
                  )
                  if (!category) return null

                  return (
                    <button
                      key={category.id}
                      type="button"
                      className={
                        search.filters.categoryId === category.id
                          ? 'is-active'
                          : undefined
                      }
                      aria-pressed={
                        search.filters.categoryId === category.id
                      }
                      onClick={() => chooseCategory(category.id)}
                    >
                      {category.label}
                    </button>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        <section className="catalog-filter-panel" aria-labelledby="filters-title">
          <div className="catalog-filter-panel__heading">
            <h2 id="filters-title">
              <SlidersHorizontal aria-hidden="true" />
              Фильтры
            </h2>
            {hasSearchSettings && (
              <button type="button" onClick={resetSearch}>
                Сбросить всё
              </button>
            )}
          </div>

          <div className="catalog-filter-chips" aria-label="Быстрые фильтры">
            <button
              type="button"
              className={search.filters.availableOnly ? 'is-active' : undefined}
              aria-pressed={search.filters.availableOnly}
              onClick={() => toggleFilter('availableOnly')}
            >
              В наличии
            </button>
            <button
              type="button"
              className={search.filters.saleOnly ? 'is-active' : undefined}
              aria-pressed={search.filters.saleOnly}
              onClick={() => toggleFilter('saleOnly')}
            >
              Со скидкой
            </button>
            <button
              type="button"
              className={
                search.filters.ownProductionOnly ? 'is-active' : undefined
              }
              aria-pressed={search.filters.ownProductionOnly}
              onClick={() => toggleFilter('ownProductionOnly')}
            >
              Наше производство
            </button>
          </div>

          <div className="catalog-controls">
            <label>
              <span>Категория</span>
              <select
                value={search.filters.categoryId}
                onChange={(event) => {
                  const value = event.target.value
                  setSearchFilters({
                    categoryId: isProductCategoryId(value) ? value : 'all',
                  })
                }}
              >
                <option value="all">Все категории</option>
                {catalogCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Сортировка</span>
              <select
                value={search.sort}
                onChange={(event) =>
                  setSearchSort(event.target.value as CatalogSort)
                }
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {appliedFilterLabels.length > 0 && (
            <div className="catalog-applied-filters" aria-label="Применённые фильтры">
              <span>Применено:</span>
              {appliedFilterLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          )}
        </section>

        <div className="catalog-results-heading" aria-live="polite">
          <h2>{search.query.trim() ? 'Результаты поиска' : 'Все товары'}</h2>
          <span>{formatProductCount(visibleProducts.length)}</span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid catalog-product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={() => {
                  const scroller = document.querySelector<HTMLElement>('.app-scroll')
                  if (scroller) setSearchScrollTop(scroller.scrollTop)
                  const query = search.query.trim()
                  if (query) addRecentQuery(query)
                }}
              />
            ))}
          </div>
        ) : (
          <section className="catalog-empty" aria-labelledby="catalog-empty-title">
            <Search aria-hidden="true" />
            <h2 id="catalog-empty-title">Ничего не нашли</h2>
            <p>
              Проверьте запрос или сбросьте фильтры — покажем весь каталог.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={resetSearch}
            >
              Показать все товары
            </button>
          </section>
        )}
      </div>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
