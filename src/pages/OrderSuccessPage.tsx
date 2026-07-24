import {
  Award,
  CheckCircle2,
  Clock3,
  CreditCard,
  Home,
  MapPin,
  PackageOpen,
  Smartphone,
} from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useShop } from '../context/ShopContext'
import { formatSavedDeliveryDate } from '../lib/deliveryDates'
import { formatPrice, formatProductCount } from '../lib/format'
import type { PaymentMethod } from '../types'

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Банковская карта',
  sbp: 'СБП',
}

const PaymentIcon = ({ method }: { method: PaymentMethod }) => {
  const Icon = method === 'card' ? CreditCard : Smartphone
  return <Icon aria-hidden="true" />
}

export function OrderSuccessPage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const { clearOrderedCart, getOrder } = useShop()
  const matchedOrder = orderId ? getOrder(decodeURIComponent(orderId)) : null

  useEffect(() => {
    if (matchedOrder) clearOrderedCart(matchedOrder.id)
  }, [clearOrderedCart, matchedOrder])

  if (!matchedOrder) {
    return (
      <main className="screen screen--order-state">
        <PageHeader
          title="Заказ"
          backTo="/"
          showCart={false}
          headingLevel="none"
        />
        <section className="order-not-found" aria-labelledby="order-not-found-title">
          <PackageOpen aria-hidden="true" />
          <h1 id="order-not-found-title">Демонстрационный заказ не найден</h1>
          <p>
            Создайте новый заказ — после оформления его снимок останется в
            приложении даже при пустой корзине.
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

  const order = matchedOrder
  const deliveryDate = formatSavedDeliveryDate(order.deliverySlot)

  return (
    <main className="screen screen--order-success">
      <PageHeader
        title="Заказ оформлен"
        backTo="/"
        showCart={false}
        headingLevel="none"
      />

      <section className="success-hero" aria-labelledby="success-title">
        <span className="success-hero__icon">
          <CheckCircle2 aria-hidden="true" />
        </span>
        <span className="success-hero__eyebrow">Всё получилось</span>
        <h1 id="success-title">Заказ принят</h1>
        <p>
          Мы получили заказ и скоро начнём сборку. Никакие данные и платёжные
          запросы не отправлены — это локальная демонстрация.
        </p>
        <span className="success-hero__number">№ {order.id}</span>
      </section>

      <section className="success-details" aria-labelledby="delivery-details-title">
        <h2 id="delivery-details-title">Доставка</h2>
        <div className="success-detail-row">
          <MapPin aria-hidden="true" />
          <span>
            <small>Адрес</small>
            <strong>{order.address.street}</strong>
            <span>{order.address.city}</span>
          </span>
        </div>
        <div className="success-detail-row">
          <Clock3 aria-hidden="true" />
          <span>
            <small>Ожидаемый интервал</small>
            <strong>
              {deliveryDate.dayLabel}, {deliveryDate.dateLabel}
            </strong>
            <span>{order.deliverySlot.timeLabel}</span>
          </span>
        </div>
        <div className="success-detail-row">
          <PaymentIcon method={order.paymentMethod} />
          <span>
            <small>Способ оплаты</small>
            <strong>{paymentLabels[order.paymentMethod]}</strong>
            <span>Демонстрационный выбор</span>
          </span>
        </div>
      </section>

      <section className="success-order" aria-labelledby="success-order-title">
        <div className="success-order__heading">
          <div>
            <h2 id="success-order-title">Состав заказа</h2>
            <span>{formatProductCount(order.totals.itemCount)}</span>
          </div>
          <strong>{formatPrice(order.totals.payableTotal)} ₽</strong>
        </div>
        <ul className="order-preview-list">
          {order.lines.map((line) => (
            <li key={line.productId}>
              <img
                src={line.image}
                alt=""
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
              />
              <span>
                <strong>{line.name}</strong>
                <small>
                  {line.quantity} × {formatPrice(line.unitPrice)} ₽ · {line.weight}
                </small>
              </span>
              <b>{formatPrice(line.unitPrice * line.quantity)} ₽</b>
            </li>
          ))}
        </ul>
      </section>

      <section className="success-bonus" aria-labelledby="success-bonus-title">
        <Award aria-hidden="true" />
        <span>
          <small id="success-bonus-title">Начислим после выполнения заказа</small>
          <strong>+{formatPrice(order.totals.bonusEarned)} бонусов</strong>
        </span>
      </section>

      <div className="success-actions">
        <button
          type="button"
          className="primary-button primary-button--wide"
          onClick={() =>
            navigate(`/orders/${encodeURIComponent(order.id)}/tracking`, {
              state: {
                from: `/orders/${encodeURIComponent(order.id)}/success`,
              },
            })
          }
        >
          <PackageOpen aria-hidden="true" />
          Открыть заказ
        </button>
        <button
          type="button"
          className="secondary-button secondary-button--wide"
          onClick={() => navigate('/')}
        >
          <Home aria-hidden="true" />
          Вернуться на главную
        </button>
      </div>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
