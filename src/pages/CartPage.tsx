import {
  AlertTriangle,
  Gift,
  MapPin,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppPortal } from '../components/AppPortal'
import { PageHeader } from '../components/PageHeader'
import { QuantityControl } from '../components/QuantityControl'
import { DEMO_RULES } from '../config/demoRules'
import { useShop } from '../context/ShopContext'
import { calculateOrderTotals, getCartItems } from '../lib/cart'
import { publicAssetUrl } from '../lib/deployment'
import {
  getDeliveryRestriction,
  getUndeliverableCartItems,
} from '../lib/deliveryAvailability'
import {
  formatBonusCount,
  formatPrice,
  formatProductCount,
} from '../lib/format'

export function CartPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const sourcePath = (location.state as { from?: string } | null)?.from
  const {
    address,
    bonusBalance,
    cart,
    deliveryCity,
    openAddress,
    removeFromCart,
    setQuantity,
  } = useShop()
  const cartItems = useMemo(() => getCartItems(cart), [cart])
  const totals = useMemo(
    () => calculateOrderTotals(cart, 0, bonusBalance),
    [bonusBalance, cart],
  )
  const undeliverableItems = useMemo(
    () => getUndeliverableCartItems(cart, deliveryCity),
    [cart, deliveryCity],
  )
  const hasDeliveryRestrictions = undeliverableItems.length > 0
  const addressControl = (
    <button type="button" className="cart-address" onClick={openAddress}>
      <MapPin aria-hidden="true" />
      <span>
        <small>Адрес доставки</small>
        <strong>
          {address
            ? `${address.city} · ${address.street}`
            : `${deliveryCity} · Укажите улицу и дом`}
        </strong>
      </span>
      <span>{address ? 'Изменить' : 'Выбрать'}</span>
    </button>
  )

  if (cartItems.length === 0) {
    return (
      <main className="screen screen--cart has-bottom-nav">
        <PageHeader
          title="Корзина"
          showCart={false}
          onBack={() => {
            if (sourcePath) navigate(-1)
            else navigate('/')
          }}
        />
        {addressControl}
        <div className="empty-cart">
          <span>
            <ShoppingBag aria-hidden="true" />
          </span>
          <h2>Корзина пока пуста</h2>
          <p>Добавьте готовые блюда или любимые продукты из каталога</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </button>
        </div>
      </main>
    )
  }

  const freeDeliveryRemainder = Math.max(
    0,
    DEMO_RULES.freeDeliveryFrom - totals.merchandiseSubtotal,
  )
  const minimumRemainder = Math.max(
    0,
    DEMO_RULES.minimumOrder - totals.merchandiseSubtotal,
  )

  return (
    <main className="screen screen--cart has-bottom-nav has-cart-checkout">
      <PageHeader
        title="Корзина"
        showCart={false}
        onBack={() => {
          if (sourcePath) navigate(-1)
          else navigate('/')
        }}
      />
      {addressControl}

      <section className="cart-items" aria-label="Товары в корзине">
        {cartItems.map(({ product, quantity }) => {
          const deliveryRestriction = getDeliveryRestriction(
            product,
            deliveryCity,
          )

          return (
          <article className="cart-item" key={product.id}>
            <button
              type="button"
              className="cart-item__image"
              onClick={() =>
                navigate(`/product/${product.id}`, { state: { from: '/cart' } })
              }
              aria-label={`Открыть товар «${product.name}»`}
            >
              <img
                src={publicAssetUrl(product.image)}
                alt=""
                width="600"
                height="600"
                loading="lazy"
                decoding="async"
              />
            </button>
            <div className="cart-item__content">
              <div className="cart-item__topline">
                <button
                  type="button"
                  className="cart-item__name"
                  onClick={() =>
                    navigate(`/product/${product.id}`, {
                      state: { from: '/cart' },
                    })
                  }
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
                {deliveryRestriction ? (
                  <span className="cart-item__restriction">
                    {deliveryRestriction.label}
                  </span>
                ) : (
                  <QuantityControl
                    quantity={quantity}
                    onChange={(nextQuantity) =>
                      setQuantity(product.id, nextQuantity)
                    }
                    compact
                    label={`Количество товара «${product.name}»`}
                  />
                )}
                <span className="cart-item__price">
                  <strong>{formatPrice(product.price * quantity)} ₽</strong>
                  {product.oldPrice && (
                    <del>{formatPrice(product.oldPrice * quantity)} ₽</del>
                  )}
                </span>
              </div>
            </div>
          </article>
          )
        })}
      </section>

      {hasDeliveryRestrictions && (
        <div className="delivery-blocker" role="alert">
          <AlertTriangle aria-hidden="true" />
          <span>
            <strong>Эти товары нельзя доставить</strong>
            <small>
              {undeliverableItems
                .map(({ product }) => product.name)
                .join(', ')}
              . Удалите их из корзины, чтобы перейти к оформлению.
            </small>
          </span>
        </div>
      )}

      {freeDeliveryRemainder > 0 && (
        <div className="free-delivery-card">
          <Truck aria-hidden="true" />
          <div>
            <span>
              Ещё {formatPrice(freeDeliveryRemainder)} ₽ до бесплатной доставки
            </span>
            <div>
              <i
                style={{
                  width: `${Math.min(
                    (totals.merchandiseSubtotal /
                      DEMO_RULES.freeDeliveryFrom) *
                      100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bonus-spend-row" aria-label="Доступные бонусы">
        <span className="bonus-spend-row__icon">
          <Gift aria-hidden="true" />
        </span>
        <span>
          <small>Доступно</small>
          <strong>{formatBonusCount(bonusBalance)}</strong>
        </span>
        <span>Можно применить при оформлении</span>
      </div>

      <section className="order-summary" aria-labelledby="summary-title">
        <h2 id="summary-title">Сумма заказа</h2>
        <dl>
          <div>
            <dt>Товары</dt>
            <dd>{formatPrice(totals.listSubtotal)} ₽</dd>
          </div>
          <div className="order-summary__discount">
            <dt>Скидка на товары</dt>
            <dd>−{formatPrice(totals.productDiscount)} ₽</dd>
          </div>
          <div>
            <dt>Доставка</dt>
            <dd>
              {totals.deliveryFee === 0
                ? 'Бесплатно'
                : `${formatPrice(totals.deliveryFee)} ₽`}
            </dd>
          </div>
          <div className="order-summary__total">
            <dt>Итого</dt>
            <dd>{formatPrice(totals.payableTotal)} ₽</dd>
          </div>
        </dl>
      </section>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения «Табрис». Создан для
        демонстрации.
      </p>

      <AppPortal>
        <div className="cart-checkout-bar">
          <span>
            <small>
              {minimumRemainder > 0
                ? `Ещё ${formatPrice(minimumRemainder)} ₽ до минимума`
                : formatProductCount(totals.itemCount)}
            </small>
            <strong>{formatPrice(totals.payableTotal)} ₽</strong>
          </span>
          <button
            type="button"
            className="primary-button"
            disabled={
              !totals.minimumOrderReached || hasDeliveryRestrictions
            }
            onClick={() => navigate('/checkout')}
          >
            Перейти к оформлению
          </button>
        </div>
      </AppPortal>
    </main>
  )
}
