import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { useShop } from '../context/ShopContext'
import { products } from '../data/products'

export function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteIds } = useShop()
  const favoriteProducts = favoriteIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is (typeof products)[number] => Boolean(product))

  return (
    <main className="screen screen--favorites has-bottom-nav">
      <PageHeader title="Избранное" backTo="/" />

      {favoriteProducts.length > 0 ? (
        <section className="favorites-content" aria-labelledby="favorites-title">
          <div className="favorites-heading">
            <h2 id="favorites-title">Сохранённые товары</h2>
            <span>{favoriteProducts.length}</span>
          </div>
          <div className="product-grid favorites-grid">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="favorites-empty" aria-labelledby="favorites-empty-title">
          <span className="favorites-empty__icon" aria-hidden="true">
            <Heart />
          </span>
          <h2 id="favorites-empty-title">Сохраняйте то, что нравится</h2>
          <p>
            Нажмите на сердечко в карточке товара — он появится здесь и не
            потеряется.
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </button>
        </section>
      )}

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
