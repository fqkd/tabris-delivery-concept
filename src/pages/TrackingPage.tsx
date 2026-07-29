import {
  Bike,
  Check,
  CheckCircle2,
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
} from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useShop } from '../context/ShopContext'
import { formatSavedDeliveryDate } from '../lib/deliveryDates'
import { formatPrice, formatProductCount } from '../lib/format'
import { buildTrackingTimeline } from '../lib/order'
import { publicAssetUrl } from '../lib/deployment'
import type { OrderStatus, PaymentMethod } from '../types'

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Банковская карта',
  sbp: 'СБП',
}

const statusPresentation: Record<
  OrderStatus,
  {
    eyebrow: string
    title: string
    description: string
    icon: typeof Bike
  }
> = {
  placed: {
    eyebrow: 'Текущий статус',
    title: 'Заказ оформлен',
    description:
      'Заказ сохранён в браузере. Дальнейшие статусы в нём не меняются.',
    icon: CheckCircle2,
  },
  assembling: {
    eyebrow: 'Собираем заказ',
    title: 'Подбираем ваши товары',
    description: 'Сотрудники магазина собирают и бережно упаковывают заказ.',
    icon: PackageOpen,
  },
  courier: {
    eyebrow: 'Передали курьеру',
    title: 'Заказ у курьера',
    description: 'Курьер получил заказ и готовится начать доставку.',
    icon: PackageCheck,
  },
  delivering: {
    eyebrow: 'Заказ в пути',
    title: 'Курьер едет к вам',
    description: 'Заказ уже покинул магазин и движется к адресу доставки.',
    icon: Bike,
  },
  delivered: {
    eyebrow: 'Заказ доставлен',
    title: 'Спасибо за заказ',
    description: 'Заказ передан получателю.',
    icon: CheckCircle2,
  },
}

const formatLocationUpdate = (occurredAt: string | undefined) => {
  if (!occurredAt) return 'Позиция обновлена недавно'
  const minutes = Math.max(
    0,
    Math.round((Date.now() - Date.parse(occurredAt)) / 60_000),
  )
  if (minutes === 0) return 'Позиция обновлена только что'
  if (minutes === 1) return 'Позиция обновлена минуту назад'
  if (minutes >= 2 && minutes <= 4) {
    return `Позиция обновлена ${minutes} минуты назад`
  }
  return `Позиция обновлена ${minutes} минут назад`
}

export function TrackingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId } = useParams()
  const { getOrder } = useShop()
  const order = orderId ? getOrder(decodeURIComponent(orderId)) : null
  const sourcePath = (location.state as { from?: string } | null)?.from

  if (!order) {
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

  const deliveryDate = formatSavedDeliveryDate(order.deliverySlot)
  const timeline = buildTrackingTimeline(order)
  const presentation = statusPresentation[order.status]
  const StatusIcon = presentation.icon
  const showCourierRoute = order.status === 'delivering' && Boolean(order.eta)
  const PaymentIcon = order.paymentMethod === 'card' ? CreditCard : Smartphone

  return (
    <main className="screen screen--tracking">
      <PageHeader
        title={`Заказ № ${order.id}`}
        onBack={() => {
          if (sourcePath) navigate(-1)
          else navigate('/profile')
        }}
        showCart={false}
        headingLevel="none"
      />

      <section className="tracking-status" aria-labelledby="tracking-status-title">
        <span className="tracking-status__icon">
          <StatusIcon aria-hidden="true" />
        </span>
        <span className="tracking-status__eyebrow">
          {presentation.eyebrow}
        </span>
        <h1 id="tracking-status-title">{presentation.title}</h1>
        <p>{presentation.description}</p>
        <div className="tracking-status__eta">
          <Clock3 aria-hidden="true" />
          <span>
            <small>Интервал доставки</small>
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

      {showCourierRoute && order.eta && (
        <section className="tracking-route" aria-labelledby="route-title">
          <div className="tracking-route__heading">
            <div>
              <span>Демо-маршрут</span>
              <h2 id="route-title">Маршрут доставки</h2>
              <p>{formatLocationUpdate(order.courierLocationUpdatedAt)}</p>
            </div>
            <Navigation aria-hidden="true" />
          </div>
          <div className="tracking-map-card">
            <img
              src={publicAssetUrl('/images/maps/courier-delivery-route.png')}
              alt="Демонстрационная карта маршрута курьера от магазина к адресу доставки"
              width="1536"
              height="1024"
              decoding="async"
            />
            <span className="tracking-map-card__eta">
              Будет через {order.eta.minMinutes}–{order.eta.maxMinutes} минут
            </span>
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
      )}

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
                src={publicAssetUrl(line.image)}
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
