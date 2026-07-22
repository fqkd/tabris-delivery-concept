import { ChevronRight, Gift, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPortal } from '../components/AppPortal'
import { PageHeader } from '../components/PageHeader'
import { QuantityControl } from '../components/QuantityControl'
import { useShop } from '../context/ShopContext'
import { products } from '../data/products'
import { formatPrice } from '../lib/format'

export function CartPage() {
  const navigate = useNavigate()
  const { cart, setQuantity, removeFromCart } = useShop()
  const [showNotice, setShowNotice] = useState(false)

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({ product, quantity: cart[product.id] })),
    [cart],
  )

  const baseSubtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.product.oldPrice ?? item.product.price) * item.quantity,
    0,
  )
  const currentSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const discount = baseSubtotal - currentSubtotal
  const delivery = currentSubtotal >= 1500 || currentSubtotal === 0 ? 0 : 149
  const total = currentSubtotal + delivery

  if (cartItems.length === 0) {
    return (
      <main className="screen screen--cart has-bottom-nav">
        <PageHeader title="Корзина" showCart={false} />
        <div className="empty-cart">
          <span>
            <ShoppingBag aria-hidden="true" />
          </span>
          <h2>Корзина пока пуста</h2>
          <p>Добавьте блюда собственного производства или любимые продукты</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/category/own-production')}
          >
            Перейти в каталог
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="screen screen--cart has-bottom-nav has-cart-checkout">
      <PageHeader title="Корзина" showCart={false} />

      <section className="cart-items" aria-label="Товары в корзине">
        {cartItems.map(({ product, quantity }) => (
          <article className="cart-item" key={product.id}>
            <button
              type="button"
              className="cart-item__image"
              onClick={() => navigate(`/product/${product.id}`)}
              aria-label={`Открыть товар «${product.name}»`}
            >
              <img src={product.image} alt="" />
            </button>
            <div className="cart-item__content">
              <div className="cart-item__topline">
                <button
                  type="button"
                  className="cart-item__name"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </button>
                <button
                  type="button"
                  className="cart-item__delete"
                  aria-label={`Удалить «${product.name}»`}
                  onClick={() => removeFromCart(product.id)}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
              <span className="cart-item__weight">{product.weight}</span>
              <div className="cart-item__bottomline">
                <QuantityControl
                  quantity={quantity}
                  onChange={(nextQuantity) =>
                    setQuantity(product.id, nextQuantity)
                  }
                  compact
                  label={`Количество товара «${product.name}»`}
                />
                <span className="cart-item__price">
                  <strong>{formatPrice(product.price * quantity)} ₽</strong>
                  {product.oldPrice && (
                    <del>{formatPrice(product.oldPrice * quantity)} ₽</del>
                  )}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {currentSubtotal < 1500 && (
        <div className="free-delivery-card">
          <Truck aria-hidden="true" />
          <div>
            <span>
              Ещё {formatPrice(1500 - currentSubtotal)} ₽ до бесплатной доставки
            </span>
            <div>
              <i style={{ width: `${Math.min((currentSubtotal / 1500) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      <button type="button" className="bonus-spend-row">
        <span className="bonus-spend-row__icon">
          <Gift aria-hidden="true" />
        </span>
        <span>
          <small>Доступно</small>
          <strong>2 480 бонусов</strong>
        </span>
        <span>Списать на оформлении</span>
        <ChevronRight aria-hidden="true" />
      </button>

      <section className="order-summary" aria-labelledby="summary-title">
        <h2 id="summary-title">Сумма заказа</h2>
        <dl>
          <div>
            <dt>Товары</dt>
            <dd>{formatPrice(baseSubtotal)} ₽</dd>
          </div>
          <div className="order-summary__discount">
            <dt>Скидка</dt>
            <dd>−{formatPrice(discount)} ₽</dd>
          </div>
          <div>
            <dt>Доставка</dt>
            <dd>{delivery === 0 ? 'Бесплатно' : `${formatPrice(delivery)} ₽`}</dd>
          </div>
          <div className="order-summary__total">
            <dt>Итого</dt>
            <dd>{formatPrice(total)} ₽</dd>
          </div>
        </dl>
      </section>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>

      <AppPortal>
        {showNotice && (
          <div className="stage-notice" role="status">
            Оформление появится на следующем этапе
          </div>
        )}
        <div className="cart-checkout-bar">
          <span>
            <small>Итого</small>
            <strong>{formatPrice(total)} ₽</strong>
          </span>
          <button
            type="button"
            className="primary-button"
            onClick={() => setShowNotice(true)}
          >
            Перейти к оформлению
          </button>
        </div>
      </AppPortal>
    </main>
  )
}
