import { Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { discountPercent, formatPrice } from '../lib/format'
import type { Product } from '../types'
import { QuantityControl } from './QuantityControl'

type ProductCardProps = {
  product: Product
  variant?: 'grid' | 'rail'
}

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const { cart, setQuantity } = useShop()
  const [isFavorite, setFavorite] = useState(false)
  const quantity = cart[product.id] ?? 0
  const discount = discountPercent(product.price, product.oldPrice)

  return (
    <article className={`product-card product-card--${variant}`}>
      <div className="product-card__visual">
        <Link
          to={`/product/${product.id}`}
          className="product-card__image-link"
          aria-label={`Открыть товар «${product.name}»`}
        >
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.ownProduction && (
          <span className="product-card__badge">Наше производство</span>
        )}
        {discount > 0 && (
          <span className="product-card__discount">−{discount}%</span>
        )}
        <button
          type="button"
          className={`favorite-button${isFavorite ? ' is-active' : ''}`}
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={isFavorite}
          onClick={() => setFavorite((current) => !current)}
        >
          <Heart aria-hidden="true" />
        </button>
        {product.unavailable && (
          <span className="product-card__unavailable">Временно нет</span>
        )}
      </div>

      <div className="product-card__body">
        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>
        <span className="product-card__weight">{product.weight}</span>

        <div className="product-card__footer">
          <div className="product-card__price">
            <strong>{formatPrice(product.price)} ₽</strong>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)} ₽</del>}
          </div>

          {product.unavailable ? (
            <button type="button" className="add-button" disabled>
              Нет
            </button>
          ) : quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onChange={(nextQuantity) =>
                setQuantity(product.id, nextQuantity)
              }
              compact
              label={`Количество товара «${product.name}»`}
            />
          ) : (
            <button
              type="button"
              className="add-button"
              aria-label={`Добавить «${product.name}» в корзину`}
              onClick={() => setQuantity(product.id, 1)}
            >
              <Plus aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
