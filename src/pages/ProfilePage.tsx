import {
  ChevronRight,
  Clock3,
  Gift,
  Heart,
  Info,
  MapPin,
  PackageCheck,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DemoReceiptToggle } from '../components/DemoReceiptToggle'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { useShop } from '../context/ShopContext'
import { products } from '../data/products'
import { formatSavedDeliveryDate } from '../lib/deliveryDates'
import { formatPrice } from '../lib/format'
import { orderStatusLabels } from '../lib/order'

export function ProfilePage() {
  const navigate = useNavigate()
  const {
    profile,
    address,
    openAddress,
    favoriteIds,
    orders,
  } = useShop()

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds],
  )
  return (
    <main className="screen screen--profile has-bottom-nav">
      <PageHeader title="Профиль" backTo="/" />

      <section className="profile-identity" aria-labelledby="profile-name">
        <span className="profile-identity__avatar" aria-hidden="true">
          <UserRound />
        </span>
        <div className="profile-identity__copy">
          <small>Демонстрационный аккаунт</small>
          <h2 id="profile-name">{profile.name}</h2>
          <span>{profile.phone}</span>
        </div>
      </section>

      <section className="profile-section" aria-labelledby="profile-delivery-title">
        <div className="profile-section__heading">
          <div>
            <span>Доставка</span>
            <h2 id="profile-delivery-title">Мой адрес</h2>
          </div>
        </div>
        <button
          type="button"
          className="profile-action-row"
          onClick={openAddress}
        >
          <span className="profile-action-row__icon" aria-hidden="true">
            <MapPin />
          </span>
          <span className="profile-action-row__copy">
            <strong>
              {address?.street ?? 'Выберите адрес доставки'}
            </strong>
            <small>
              {address
                ? `${address.city} · ${address.deliveryTime}`
                : 'Он сохранится в этом демонстрационном профиле'}
            </small>
          </span>
          <span className="profile-action-row__action">
            {address ? 'Изменить' : 'Выбрать'}
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
      </section>

      <section className="profile-section" aria-labelledby="profile-bonus-title">
        <div className="profile-section__heading">
          <div>
            <span>Программа лояльности</span>
            <h2 id="profile-bonus-title">Табрис Бонус</h2>
          </div>
        </div>
        <button
          type="button"
          className="profile-action-row profile-action-row--bonus"
          onClick={() => navigate('/bonus')}
        >
          <span className="profile-action-row__icon" aria-hidden="true">
            <Gift />
          </span>
          <span className="profile-action-row__copy">
            <strong>Карта, баланс и любимые категории</strong>
            <small>Открыть демонстрационный раздел программы</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
      </section>

      <section className="profile-section" aria-labelledby="profile-order-title">
        <div className="profile-section__heading">
          <div>
            <span>Покупки</span>
            <h2 id="profile-order-title">История заказов</h2>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="profile-order-list">
            {orders.map((order) => {
              const deliveryDate = formatSavedDeliveryDate(order.deliverySlot)

              return (
                <button
                  key={order.id}
                  type="button"
                  className="profile-order-card"
                  onClick={() =>
                    navigate(`/orders/${encodeURIComponent(order.id)}/tracking`, {
                      state: { from: '/profile' },
                    })
                  }
                >
                  <span
                    className="profile-order-card__icon"
                    aria-hidden="true"
                  >
                    <PackageCheck />
                  </span>
                  <span className="profile-order-card__copy">
                    <span>
                      <strong>{order.id}</strong>
                      <small>{orderStatusLabels[order.status]}</small>
                    </span>
                    <span className="profile-order-card__meta">
                      <span>
                        <Clock3 aria-hidden="true" />
                        {deliveryDate.dayLabel}, {deliveryDate.dateLabel},{' '}
                        {order.deliverySlot.timeLabel}
                      </span>
                      <span>{formatPrice(order.totals.payableTotal)} ₽</span>
                    </span>
                  </span>
                  <ChevronRight aria-hidden="true" />
                </button>
              )
            })}
          </div>
        ) : (
          <div className="profile-empty-state">
            <span aria-hidden="true">
              <ShoppingBag />
            </span>
            <div>
              <strong>Заказов пока нет</strong>
              <p>
                После демонстрационного оформления здесь появятся заказ и его
                статус.
              </p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate('/catalog')}
            >
              Перейти в каталог
            </button>
          </div>
        )}
      </section>

      <section className="profile-section" aria-labelledby="profile-favorites-title">
        <div className="profile-section__heading profile-section__heading--action">
          <div>
            <span>Сохранённое</span>
            <h2 id="profile-favorites-title">Избранные товары</h2>
          </div>
          {favoriteProducts.length > 0 && (
            <button type="button" onClick={() => navigate('/favorites')}>
              Все <ChevronRight aria-hidden="true" />
            </button>
          )}
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="profile-favorites-grid">
            {favoriteProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="profile-empty-state profile-empty-state--compact">
            <span aria-hidden="true">
              <Heart />
            </span>
            <div>
              <strong>Здесь будут любимые товары</strong>
              <p>Добавляйте их сердцем в каталоге или на странице товара.</p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate('/catalog')}
            >
              Найти товары
            </button>
          </div>
        )}
      </section>

      <section className="profile-section" aria-labelledby="profile-settings-title">
        <div className="profile-section__heading">
          <div>
            <span>Настройки</span>
            <h2 id="profile-settings-title">Чеки</h2>
          </div>
        </div>
        <DemoReceiptToggle />
        <p className="profile-section__hint">
          Переключатель работает локально и сохраняется только для демонстрации
          интерфейса.
        </p>
      </section>

      <section className="profile-about" aria-labelledby="profile-about-title">
        <Info aria-hidden="true" />
        <div>
          <h2 id="profile-about-title">О приложении</h2>
          <p>
            Интерактивный концепт собственного сервиса доставки. Заказы,
            оплата, карта и данные профиля не отправляются во внешние системы.
          </p>
        </div>
      </section>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
