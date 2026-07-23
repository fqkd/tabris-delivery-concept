import {
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Home,
  MapPin,
  Navigation,
  PackageCheck,
  PackageOpen,
  ShoppingBag,
  Smartphone,
  Store,
  Truck,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useShop } from '../context/ShopContext'
import { formatSavedDeliveryDate } from '../lib/deliveryDates'
import { formatPrice, formatProductCount } from '../lib/format'
import { buildTrackingTimeline } from '../lib/order'
import type { OrderStatus, PaymentMethod } from '../types'

const statusLabels: Record<OrderStatus, string> = {
  placed: 'Заказ оформлен',
  assembling: 'Собираем заказ',
  courier: 'Передали курьеру',
  delivering: 'Доставляем',
  delivered: 'Заказ доставлен',
}

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Банковская карта',
  sbp: 'СБП',
}

export function TrackingPage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const { lastOrder } = useShop()

  if (
    !lastOrder ||
    (orderId && decodeURIComponent(orderId) !== lastOrder.id)
  ) {
    return (
      <main className="screen screen--order-state">
        <PageHeader
          title="Отслеживание"
          backTo="/"
          showCart={false}
          headingLevel="none"
        />
        <section className="order-not-found" aria-labelledby="tracking-empty-title">
          <PackageOpen aria-hidden="true" />
          <h1 id="tracking-empty-title">Заказ для отслеживания не найден</h1>
          <p>
            После демонстрационного оформления здесь появятся этапы сборки и
            доставки.
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/')}
          >
            Вернуться на главную
          </button>
        </section>
      </main>
    )
  }

  const order = lastOrder
  const deliveryDate = formatSavedDeliveryDate(order.deliverySlot)
  const timeline = buildTrackingTimeline(order)
  const PaymentIcon = order.paymentMethod === 'card' ? CreditCard : Smartphone
  const showCourierMarker =
    order.status === 'courier' || order.status === 'delivering'

  return (
    <main className="screen screen--tracking">
      <PageHeader
        title={`Заказ № ${order.id}`}
        backTo="/profile"
        showCart={false}
        headingLevel="none"
      />

      <section className="tracking-status" aria-labelledby="tracking-status-title">
        <span className="tracking-status__icon">
          <PackageCheck aria-hidden="true" />
        </span>
        <span className="tracking-status__eyebrow">Текущий статус</span>
        <h1 id="tracking-status-title">{statusLabels[order.status]}</h1>
        <p>Бережно подбираем свежие продукты и готовые блюда.</p>
        <div className="tracking-status__eta">
          <Clock3 aria-hidden="true" />
          <span>
            <small>Ожидаемая доставка</small>
            <strong>
              {deliveryDate.dayLabel}, {deliveryDate.dateLabel}
            </strong>
            <span>{order.deliverySlot.timeLabel}</span>
          </span>
        </div>
      </section>

      <section className="tracking-timeline" aria-labelledby="tracking-timeline-title">
        <h2 id="tracking-timeline-title">Этапы заказа</h2>
        <ol>
          {timeline.map((step) => (
            <li key={step.id} className={`is-${step.state}`}>
              <span className="tracking-timeline__marker" aria-hidden="true">
                {step.state === 'complete' ? <Check /> : <i />}
              </span>
              <span className="tracking-timeline__content">
                <strong>{step.label}</strong>
                <small>{step.description}</small>
              </span>
              {step.time && (
                <time className="tracking-timeline__time">{step.time}</time>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="tracking-route" aria-labelledby="route-title">
        <div className="tracking-route__heading">
          <div>
            <h2 id="route-title">Условная схема маршрута</h2>
            <p>Не отображает реальное положение курьера</p>
          </div>
          <Navigation aria-hidden="true" />
        </div>
        <div
          className="route-schematic"
          role="img"
          aria-label={
            showCourierMarker
              ? 'Условная схема от магазина к адресу с демонстрационной отметкой курьера'
              : 'Условная схема от магазина к адресу; положение курьера пока не показывается'
          }
        >
          <i className="route-schematic__road route-schematic__road--one" />
          <i className="route-schematic__road route-schematic__road--two" />
          <i className="route-schematic__road route-schematic__road--three" />
          <span className="route-schematic__origin" aria-hidden="true">
            <Store />
          </span>
          <span className="route-schematic__destination" aria-hidden="true">
            <MapPin />
          </span>
          {showCourierMarker && (
            <span className="route-schematic__courier" aria-hidden="true">
              <Truck />
            </span>
          )}
          {!showCourierMarker && (
            <span className="route-schematic__pending">
              Маршрут уточнится после сборки
            </span>
          )}
        </div>
        <div className="tracking-address">
          <MapPin aria-hidden="true" />
          <span>
            <small>Адрес доставки</small>
            <strong>{order.address.street}</strong>
            <span>{order.address.city}</span>
          </span>
        </div>
      </section>

      <details className="tracking-composition">
        <summary>
          <span>
            <ShoppingBag aria-hidden="true" />
            <span>
              <strong>Состав заказа</strong>
              <small>{formatProductCount(order.totals.itemCount)}</small>
            </span>
          </span>
          <ChevronDown aria-hidden="true" />
        </summary>
        <ul>
          {order.lines.map((line) => (
            <li key={line.productId}>
              <img
                src={line.image}
                alt=""
                width="52"
                height="52"
                loading="lazy"
                decoding="async"
              />
              <span>
                <strong>{line.name}</strong>
                <small>
                  {line.quantity} × {formatPrice(line.unitPrice)} ₽
                </small>
              </span>
              <b>{formatPrice(line.unitPrice * line.quantity)} ₽</b>
            </li>
          ))}
        </ul>
      </details>

      <section className="tracking-summary" aria-labelledby="tracking-summary-title">
        <h2 id="tracking-summary-title">Детали заказа</h2>
        <dl>
          <div>
            <dt>Товары и доставка</dt>
            <dd>
              {formatPrice(
                order.totals.merchandiseSubtotal + order.totals.deliveryFee,
              )}{' '}
              ₽
            </dd>
          </div>
          {order.totals.bonusSpent > 0 && (
            <div>
              <dt>Списано бонусов</dt>
              <dd>−{formatPrice(order.totals.bonusSpent)} ₽</dd>
            </div>
          )}
          <div className="tracking-summary__total">
            <dt>Итого</dt>
            <dd>{formatPrice(order.totals.payableTotal)} ₽</dd>
          </div>
        </dl>
        <div className="tracking-payment">
          <PaymentIcon aria-hidden="true" />
          <span>
            <small>Способ оплаты</small>
            <strong>{paymentLabels[order.paymentMethod]}</strong>
          </span>
        </div>
      </section>

      <button
        type="button"
        className="secondary-button secondary-button--wide tracking-home-button"
        onClick={() => navigate('/')}
      >
        <Home aria-hidden="true" />
        Вернуться на главную
      </button>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
