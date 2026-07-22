import {
  ArrowRight,
  CakeSlice,
  ChefHat,
  ChevronDown,
  Clock3,
  Fish,
  Milk,
  Search,
  ShoppingBag,
  Sparkles,
  Utensils,
  WalletCards,
  Wheat,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useShop } from '../context/ShopContext'
import { products } from '../data/products'
import { formatPrice } from '../lib/format'
import type { ProductCategoryId } from '../types'

type Category = {
  label: string
  icon: LucideIcon
  categoryId?: ProductCategoryId
  ownProduction?: boolean
}

const categories: Category[] = [
  {
    label: 'Наше производство',
    icon: Sparkles,
    ownProduction: true,
  },
  { label: 'Готовые блюда', icon: Utensils, categoryId: 'ready' },
  { label: 'Сыры', icon: Milk, categoryId: 'cheese' },
  { label: 'Выпечка', icon: Wheat, categoryId: 'bakery' },
  { label: 'Рыба', icon: Fish, categoryId: 'fish' },
  { label: 'Десерты', icon: CakeSlice, categoryId: 'desserts' },
]

type SectionHeadingProps = {
  title: string
  action?: () => void
  id?: string
}

function SectionHeading({ title, action, id }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <h2 id={id}>{title}</h2>
      {action && (
        <button type="button" onClick={action}>
          Все <ArrowRight aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

type ProductRailProps = {
  productIds: string[]
}

function ProductRail({ productIds }: ProductRailProps) {
  return (
    <div className="product-rail">
      {productIds.map((id) => {
        const product = products.find((item) => item.id === id)
        return product ? (
          <ProductCard key={product.id} product={product} variant="rail" />
        ) : null
      })}
    </div>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  const {
    address,
    openAddress,
    cartCount,
    bonusBalance,
    resetSearch,
    setSearchFilters,
  } = useShop()

  const openCategory = (category: Category) => {
    if (category.ownProduction) {
      navigate('/category/own-production')
      return
    }
    resetSearch()
    if (category.categoryId) {
      setSearchFilters({ categoryId: category.categoryId })
    }
    navigate('/catalog')
  }

  return (
    <main className="screen screen--home has-bottom-nav">
      <header className="home-header">
        <div className="brand-lockup" aria-label="Табрис">
          <img
            src="/images/brand/tabris-app-mark.webp"
            alt=""
            width="34"
            height="34"
          />
          <span>Табрис</span>
        </div>
        <button
          type="button"
          className="header-cart"
          aria-label="Открыть корзину"
          onClick={() => navigate('/cart')}
        >
          <ShoppingBag aria-hidden="true" />
          {cartCount > 0 && <span>{cartCount > 9 ? '9+' : cartCount}</span>}
        </button>
      </header>

      <button type="button" className="address-bar" onClick={openAddress}>
        <span>
          <small>Доставим по адресу</small>
          <strong>{address.street}</strong>
        </span>
        <ChevronDown aria-hidden="true" />
        <span className="address-bar__time">
          <Clock3 aria-hidden="true" />
          {address.deliveryTime.replace('Сегодня, ', '')}
        </span>
      </button>

      <button
        type="button"
        className="search-bar"
        onClick={() => navigate('/catalog')}
      >
        <Search aria-hidden="true" />
        <span>Найти продукты и готовые блюда</span>
      </button>

      <button
        type="button"
        className="bonus-card"
        onClick={() => navigate('/bonus')}
      >
        <span className="bonus-card__icon">
          <WalletCards aria-hidden="true" />
        </span>
        <span>
          <small>Табрис Бонус</small>
          <strong>{formatPrice(bonusBalance)} бонусов</strong>
        </span>
        <span className="bonus-card__meta">1 бонус = 1 ₽</span>
        <ArrowRight aria-hidden="true" />
      </button>

      <section className="home-section home-section--categories" aria-labelledby="categories-title">
        <SectionHeading title="Категории" id="categories-title" />
        <div className="category-rail">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.label}
                type="button"
                onClick={() => openCategory(category)}
              >
                <span>
                  <Icon aria-hidden="true" />
                </span>
                {category.label}
              </button>
            )
          })}
        </div>
      </section>

      <button
        type="button"
        className="promo-card dinner-feature"
        onClick={() => navigate('/dinner')}
      >
        <span className="promo-card__copy">
          <small><ChefHat aria-hidden="true" /> Собрать ужин</small>
          <strong>Ужин, о котором уже позаботились за вас</strong>
          <span>
            Выбрать набор <ArrowRight aria-hidden="true" />
          </span>
        </span>
        <img
          src="/images/products/chicken-mushroom-pasta.webp"
          alt="Паста с курицей и грибами"
          width="600"
          height="600"
          decoding="async"
        />
      </button>

      <section className="home-section">
        <SectionHeading
          title="Наше производство"
          action={() => navigate('/category/own-production')}
        />
        <ProductRail
          productIds={['salad-roast-beef', 'syrniki', 'korean-beef-rice']}
        />
      </section>

      <section className="home-section">
        <SectionHeading
          title="Готовые блюда"
          action={() => {
            resetSearch()
            setSearchFilters({ categoryId: 'ready' })
            navigate('/catalog')
          }}
        />
        <ProductRail
          productIds={[
            'chicken-mushroom-pasta',
            'salmon-roll',
            'butter-croissant',
          ]}
        />
      </section>

      <section className="home-section">
        <SectionHeading
          title="Выгодно сегодня"
          action={() => {
            resetSearch()
            setSearchFilters({ saleOnly: true })
            navigate('/catalog')
          }}
        />
        <ProductRail
          productIds={['burrata', 'signature-dessert', 'butter-croissant']}
        />
      </section>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
