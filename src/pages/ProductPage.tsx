import {
  ArrowLeft,
  Award,
  Clock3,
  Heart,
  Leaf,
  ShoppingBag,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppPortal } from '../components/AppPortal'
import { QuantityControl } from '../components/QuantityControl'
import { useShop } from '../context/ShopContext'
import { getProduct } from '../data/products'
import { discountPercent, formatPrice } from '../lib/format'

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { cart, setQuantity, cartCount } = useShop()
  const [isFavorite, setFavorite] = useState(false)
  const product = productId ? getProduct(productId) : undefined

  if (!product) {
    return (
      <main className="screen product-not-found">
        <strong>Товар не найден</strong>
        <button type="button" onClick={() => navigate('/category/own-production')}>
          Вернуться в каталог
        </button>
      </main>
    )
  }

  const quantity = cart[product.id] ?? 0
  const discount = discountPercent(product.price, product.oldPrice)

  return (
    <>
      <main className="screen screen--product">
      <div className="product-hero">
        <img src={product.image} alt={product.name} />
        <div className="product-hero__actions">
          <button
            type="button"
            className="icon-button icon-button--surface"
            aria-label="Вернуться в каталог"
            onClick={() => navigate('/category/own-production')}
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <span>
            <button
              type="button"
              className={`icon-button icon-button--surface${isFavorite ? ' is-active' : ''}`}
              aria-label={
                isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
              }
              aria-pressed={isFavorite}
              onClick={() => setFavorite((current) => !current)}
            >
              <Heart aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-button icon-button--surface icon-button--badged"
              aria-label="Открыть корзину"
              onClick={() => navigate('/cart')}
            >
              <ShoppingBag aria-hidden="true" />
              {cartCount > 0 && <span>{cartCount > 9 ? '9+' : cartCount}</span>}
            </button>
          </span>
        </div>
        {discount > 0 && <span className="product-hero__discount">−{discount}%</span>}
      </div>

      <div className="product-detail">
        {product.ownProduction && (
          <span className="production-label">
            <Leaf aria-hidden="true" />
            Наше производство
          </span>
        )}

        <h1>{product.name}</h1>
        <span className="product-detail__weight">{product.weight}</span>

        <div className="product-detail__price">
          <strong>{formatPrice(product.price)} ₽</strong>
          {product.oldPrice && <del>{formatPrice(product.oldPrice)} ₽</del>}
          {discount > 0 && <span>Выгода {discount}%</span>}
        </div>

        <p className="product-detail__description">{product.description}</p>

        <div className="product-info-card">
          <div>
            <Leaf aria-hidden="true" />
            <span>
              <small>Состав</small>
              <strong>{product.ingredients}</strong>
            </span>
          </div>
          <div>
            <Clock3 aria-hidden="true" />
            <span>
              <small>Срок годности</small>
              <strong>{product.shelfLife}</strong>
            </span>
          </div>
        </div>

        <div className="bonus-accrual">
          <Award aria-hidden="true" />
          <span>
            <small>Начислим за покупку</small>
            <strong>+{product.bonus} бонусов</strong>
          </span>
        </div>

        <p className="concept-note concept-note--product">
          Неофициальный концепт мобильного приложения “Табрис”. Создан для
          демонстрации.
        </p>
      </div>

      </main>

      <AppPortal>
        <div className="product-purchase-bar">
          {quantity > 0 ? (
            <>
              <QuantityControl
                quantity={quantity}
                onChange={(nextQuantity) =>
                  setQuantity(product.id, nextQuantity)
                }
                label={`Количество товара «${product.name}»`}
              />
              <button
                type="button"
                className="primary-button product-purchase-bar__cart"
                onClick={() => navigate('/cart')}
              >
                В корзину · {formatPrice(product.price * quantity)} ₽
              </button>
            </>
          ) : (
            <button
              type="button"
              className="primary-button primary-button--wide"
              disabled={product.unavailable}
              onClick={() => setQuantity(product.id, 1)}
            >
              {product.unavailable
                ? 'Временно нет в наличии'
                : `Добавить в корзину · ${formatPrice(product.price)} ₽`}
            </button>
          )}
        </div>
      </AppPortal>
    </>
  )
}
