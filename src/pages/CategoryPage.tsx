import { ArrowUpDown, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { ownProductionProducts } from '../data/products'
import { formatProductCount } from '../lib/format'

const tabs = [
  'Все',
  ...new Set(ownProductionProducts.map((product) => product.subcategory)),
]

export function CategoryPage() {
  const [activeTab, setActiveTab] = useState('Все')
  const [sortByPrice, setSortByPrice] = useState(false)
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const visibleProducts = useMemo(() => {
    const filtered = ownProductionProducts.filter((product) => {
      const matchesTab = activeTab === 'Все' || product.subcategory === activeTab
      const matchesAvailability = !onlyAvailable || !product.unavailable
      return matchesTab && matchesAvailability
    })

    return sortByPrice
      ? [...filtered].sort((first, second) => first.price - second.price)
      : filtered
  }, [activeTab, onlyAvailable, sortByPrice])

  return (
    <main className="screen screen--category has-bottom-nav">
      <PageHeader title="Наше производство" backTo="/" />

      <div className="category-intro">
        <p>Готовим каждый день на собственных кухнях «Табриса»</p>
      </div>

      <div className="subcategory-tabs" role="tablist" aria-label="Подкатегории">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? 'is-active' : undefined}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="catalog-tools">
        <button
          type="button"
          className={sortByPrice ? 'is-active' : undefined}
          aria-pressed={sortByPrice}
          onClick={() => setSortByPrice((current) => !current)}
        >
          <ArrowUpDown aria-hidden="true" />
          {sortByPrice ? 'Сначала дешевле' : 'По популярности'}
        </button>
        <button
          type="button"
          className={onlyAvailable ? 'is-active' : undefined}
          aria-pressed={onlyAvailable}
          onClick={() => setOnlyAvailable((current) => !current)}
        >
          <SlidersHorizontal aria-hidden="true" />
          {onlyAvailable ? 'Только в наличии' : 'Фильтры'}
        </button>
      </div>

      <div className="catalog-count">
        <span>{formatProductCount(visibleProducts.length)}</span>
        <span>Готово сегодня</span>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-filter-state">
          <strong>В этой подкатегории пока пусто</strong>
          <span>Выберите другой раздел</span>
        </div>
      )}

      <p className="concept-note">
        Неофициальный концепт мобильного приложения «Табрис». Создан для
        демонстрации.
      </p>
    </main>
  )
}
