import { Heart, Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { publicAssetUrl } from '../lib/deployment'
import { getDeliveryRestriction } from '../lib/deliveryAvailability'
import { discountPercent, formatPrice } from '../lib/format'
import type { Product } from '../types'
import { QuantityControl } from './QuantityControl'

type ProductCardProps = {
  product: Product
  variant?: 'grid' | 'rail'
  onOpen?: () => void
}

export function ProductCard({
  product,
  variant = 'grid',
  onOpen,
}: ProductCardProps) {
  const { cart, setQuantity, isFavorite, toggleFavorite } = useShop()
  const location = useLocation()
  const quantity = cart[product.id] ?? 0
  const discount = discountPercent(product.price, product.oldPrice)
  const favorite = isFavorite(product.id)
  const deliveryRestriction = getDeliveryRestriction(product)

  return (
    <article className={`product-card product-card--${variant}`}>
      <div className="product-card__visual">
        <Link
          to={`/product/${product.id}`}
          state={{ from: `${location.pathname}${location.search}` }}
          className="product-card__image-link"
          aria-label={`Открыть товар «${product.name}»`}
          onClick={onOpen}
        >
          <img
            src={publicAssetUrl(product.image)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width="600"
            height="600"
          />
        </Link>
        {product.ownProduction && (
          <span className="product-card__badge">Наше производство</span>
        )}
        {product.ageRestricted && (
          <span className="product-card__age" aria-label="Товар только для лиц старше 18 лет">
            18+
          </span>
        )}
        {discount > 0 && (
          <span className="product-card__discount">−{discount}%</span>
        )}
        <button
          type="button"
          className={`favorite-button${favorite ? ' is-active' : ''}`}
          aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart aria-hidden="true" />
        </button>
        {deliveryRestriction && (
          <span className="product-card__unavailable">
            {deliveryRestriction.label}
          </span>
        )}
      </div>

      <div className="product-card__body">
        <Link
          to={`/product/${product.id}`}
          state={{ from: `${location.pathname}${location.search}` }}
          className="product-card__name"
          onClick={onOpen}
        >
          {product.name}
        </Link>
        <span className="product-card__weight">{product.weight}</span>

        <div className="product-card__footer">
          <div className="product-card__price">
            <strong>{formatPrice(product.price)} ₽</strong>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)} ₽</del>}
          </div>

          {deliveryRestriction ? (
            <button
              type="button"
              className={`add-button${
                deliveryRestriction.code === 'store-only'
                  ? ' add-button--store-only'
                  : ''
              }`}
              disabled
            >
              {deliveryRestriction.code === 'store-only' ? 'В магазине' : 'Нет'}
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
