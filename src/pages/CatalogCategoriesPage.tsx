import { Check } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useShop } from '../context/ShopContext'
import { catalogCategories } from '../data/catalogCategories'
import { products } from '../data/products'
import { getCategoryProductCounts } from '../lib/catalog'
import { formatProductCount } from '../lib/format'
import type { ProductCategoryId } from '../types'

export function CatalogCategoriesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    search,
    setSearchFilters,
    setSearchScrollTop,
  } = useShop()
  const categoryCounts = useMemo(
    () => getCategoryProductCounts(products),
    [],
  )

  const chooseCategory = (categoryId: ProductCategoryId | 'all') => {
    const nextCategory =
      categoryId !== 'all' && search.filters.categoryId === categoryId
        ? 'all'
        : categoryId
    setSearchFilters({ categoryId: nextCategory })
    setSearchScrollTop(0)
    navigate('/catalog', {
      replace: true,
      state: { scrollToCatalogResults: true },
    })
  }

  const returnToCatalog = () => {
    const state = location.state as { fromCatalog?: boolean } | null
    if (state?.fromCatalog) {
      navigate(-1)
      return
    }

    setSearchScrollTop(0)
    navigate('/catalog', { replace: true })
  }

  return (
    <main className="screen screen--catalog-categories">
      <PageHeader
        title={`Все категории (${catalogCategories.length})`}
        onBack={returnToCatalog}
        showCart={false}
      />

      <section
        className="catalog-category-picker"
        aria-label="Выбор категории товаров"
      >
        <p>
          Выберите раздел — после выбора откроются товары с сохранёнными
          поиском, сортировкой и фильтрами.
        </p>

        <div className="catalog-category-picker__list">
          <button
            type="button"
            className={
              search.filters.categoryId === 'all' ? 'is-active' : undefined
            }
            aria-pressed={search.filters.categoryId === 'all'}
            onClick={() => chooseCategory('all')}
          >
            <span>
              <strong>Все товары</strong>
              <small>{formatProductCount(products.length)}</small>
            </span>
            {search.filters.categoryId === 'all' && (
              <Check aria-hidden="true" />
            )}
          </button>

          {catalogCategories.map((category) => {
            const active = search.filters.categoryId === category.id
            return (
              <button
                key={category.id}
                type="button"
                className={active ? 'is-active' : undefined}
                aria-pressed={active}
                onClick={() => chooseCategory(category.id)}
              >
                <span>
                  <strong>{category.label}</strong>
                  <small>
                    {formatProductCount(
                      categoryCounts.get(category.id) ?? 0,
                    )}
                  </small>
                </span>
                {active && <Check aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </section>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
