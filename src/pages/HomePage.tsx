import {
  ArrowRight,
  CakeSlice,
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

type Category = {
  label: string
  icon: LucideIcon
  path: string
}

const categories: Category[] = [
  {
    label: 'Наше производство',
    icon: Sparkles,
    path: '/category/own-production',
  },
  { label: 'Готовые блюда', icon: Utensils, path: '/section/ready-meals' },
  { label: 'Сыры', icon: Milk, path: '/section/cheese' },
  { label: 'Выпечка', icon: Wheat, path: '/section/bakery' },
  { label: 'Рыба', icon: Fish, path: '/section/fish' },
  { label: 'Десерты', icon: CakeSlice, path: '/section/desserts' },
]

type SectionHeadingProps = {
  title: string
  action?: () => void
}

function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
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
  const { address, openAddress, cartCount } = useShop()

  return (
    <main className="screen screen--home has-bottom-nav">
      <header className="home-header">
        <div className="brand-lockup" aria-label="Табрис">
          <img src="/images/brand/tabris-app-mark.webp" alt="" />
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
          16:30–17:00
        </span>
      </button>

      <button
        type="button"
        className="search-bar"
        onClick={() => navigate('/section/search')}
      >
        <Search aria-hidden="true" />
        <span>Найти продукты и готовые блюда</span>
      </button>

      <button
        type="button"
        className="bonus-card"
        onClick={() => navigate('/section/bonus')}
      >
        <span className="bonus-card__icon">
          <WalletCards aria-hidden="true" />
        </span>
        <span>
          <small>Табрис Бонус</small>
          <strong>2 480 бонусов</strong>
        </span>
        <span className="bonus-card__meta">1 бонус = 1 ₽</span>
        <ArrowRight aria-hidden="true" />
      </button>

      <section className="home-section home-section--categories" aria-labelledby="categories-title">
        <SectionHeading title="Категории" />
        <div className="category-rail" id="categories-title">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.label}
                type="button"
                onClick={() => navigate(category.path)}
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
        className="promo-card"
        onClick={() => navigate('/category/own-production')}
      >
        <span className="promo-card__copy">
          <small>Приготовлено сегодня</small>
          <strong>Ужин, о котором уже позаботились</strong>
          <span>
            Выбрать блюда <ArrowRight aria-hidden="true" />
          </span>
        </span>
        <img
          src="/images/products/chicken-mushroom-pasta.webp"
          alt="Паста с курицей и грибами"
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
        <SectionHeading title="Готовые блюда" action={() => navigate('/section/ready-meals')} />
        <ProductRail
          productIds={[
            'chicken-mushroom-pasta',
            'salmon-roll',
            'butter-croissant',
          ]}
        />
      </section>

      <section className="home-section">
        <SectionHeading title="Выгодно сегодня" action={() => navigate('/section/sale')} />
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
