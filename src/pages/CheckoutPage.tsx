import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Gift,
  MapPin,
  MessageSquareText,
  PackageCheck,
  Smartphone,
  UserRound,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPortal } from '../components/AppPortal'
import { PageHeader } from '../components/PageHeader'
import { DEMO_RULES } from '../config/demoRules'
import { useShop } from '../context/ShopContext'
import { roundBonusAmount } from '../lib/bonus'
import {
  calculateMaxBonusSpend,
  calculateOrderTotals,
  getCartItems,
} from '../lib/cart'
import {
  formatBonusCount,
  formatBonusNoun,
  formatPrice,
  formatProductCount,
} from '../lib/format'
import { createDeliverySlots } from '../lib/deliveryDates'
import { getUndeliverableCartItems } from '../lib/deliveryAvailability'
import {
  createDemoOrderId,
  createOrderSnapshot,
  hasCheckoutErrors,
  validateCheckout,
} from '../lib/order'
import type {
  DeliverySlot,
  DemoProfile,
  PaymentMethod,
  SubstitutionPolicy,
} from '../types'

const substitutionOptions: Array<{
  value: SubstitutionPolicy
  title: string
  description: string
}> = [
  {
    value: 'similar',
    title: 'Заменить похожим товаром',
    description: 'Подберём вариант близкой цены и качества',
  },
  {
    value: 'contact',
    title: 'Связаться со мной',
    description: 'Уточним замену перед сборкой',
  },
  {
    value: 'remove',
    title: 'Удалить из заказа',
    description: 'Вернём стоимость отсутствующей позиции',
  },
]

const paymentOptions: Array<{
  value: PaymentMethod
  title: string
  description: string
  icon: typeof CreditCard
}> = [
  {
    value: 'card',
    title: 'Банковская карта',
    description: 'Оплата банковской картой',
    icon: CreditCard,
  },
  {
    value: 'sbp',
    title: 'СБП',
    description: 'Оплата через приложение банка',
    icon: Smartphone,
  },
]

const demoOtherRecipient: DemoProfile = {
  name: 'Гость',
  phone: '+7 ••• •••-00-00',
}

const getDayKey = (slot: DeliverySlot) =>
  slot.dateKey

const createCityDeliverySlots = (_city: string) =>
  createDeliverySlots()

export function CheckoutPage() {
  const navigate = useNavigate()
  const {
    address,
    bonusBalance,
    cart,
    clearOrderedCart,
    deliveryCity,
    electronicReceipts,
    openAddress,
    placeOrder,
    profile,
  } = useShop()
  const [checkoutBonusBalance] = useState(() => bonusBalance)
  const cartItems = useMemo(() => getCartItems(cart), [cart])
  const deliverySlots = useMemo(
    () => createCityDeliverySlots(deliveryCity),
    [deliveryCity],
  )
  const dayOptions = useMemo(
    () =>
      Array.from(
        new Map(
          deliverySlots.map((slot) => [
            getDayKey(slot),
            { key: getDayKey(slot), label: slot.dayLabel, date: slot.dateLabel },
          ]),
        ).values(),
      ),
    [deliverySlots],
  )
  const firstAvailableSlot = deliverySlots.find((slot) => slot.available)
  const [selectedDay, setSelectedDay] = useState(
    firstAvailableSlot ? getDayKey(firstAvailableSlot) : dayOptions[0]?.key ?? '',
  )
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null)
  const [otherRecipient, setOtherRecipient] = useState(false)
  const [otherRecipientData, setOtherRecipientData] =
    useState<DemoProfile>(demoOtherRecipient)
  const [substitutionPolicy, setSubstitutionPolicy] =
    useState<SubstitutionPolicy | null>(null)
  const [courierComment, setCourierComment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [applyBonus, setApplyBonus] = useState(false)
  const [requestedBonusSpend, setRequestedBonusSpend] = useState(0)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const submitGuard = useRef(false)
  const previousCity = useRef(deliveryCity)

  const recipient = otherRecipient ? otherRecipientData : profile
  const maxBonusSpend = useMemo(
    () => calculateMaxBonusSpend(cart, checkoutBonusBalance),
    [cart, checkoutBonusBalance],
  )
  const undeliverableItems = useMemo(
    () => getUndeliverableCartItems(cart, deliveryCity),
    [cart, deliveryCity],
  )
  const deliveryIssue =
    undeliverableItems.length > 0
      ? 'Удалите товары, доступные только в магазине, перед оформлением'
      : ''

  useEffect(() => {
    setRequestedBonusSpend((current) => Math.min(current, maxBonusSpend))
    if (maxBonusSpend === 0) setApplyBonus(false)
  }, [maxBonusSpend])

  useEffect(() => {
    if (previousCity.current === deliveryCity) return
    previousCity.current = deliveryCity
    setSelectedDay(
      firstAvailableSlot
        ? getDayKey(firstAvailableSlot)
        : dayOptions[0]?.key ?? '',
    )
    setSelectedSlot(null)
  }, [dayOptions, deliveryCity, firstAvailableSlot])

  const bonusSpend = applyBonus ? requestedBonusSpend : 0
  const totals = useMemo(
    () => calculateOrderTotals(cart, bonusSpend, checkoutBonusBalance),
    [bonusSpend, cart, checkoutBonusBalance],
  )
  const errors = validateCheckout(
    {
      address,
      recipient,
      deliverySlot: selectedSlot,
      substitutionPolicy,
      paymentMethod,
      deliveryIssue,
    },
    totals,
  )
  const checkoutHasErrors = hasCheckoutErrors(errors)

  const selectDay = (dayKey: string) => {
    setSelectedDay(dayKey)
    if (selectedSlot && getDayKey(selectedSlot) !== dayKey) {
      setSelectedSlot(null)
    }
  }

  const toggleBonus = () => {
    setApplyBonus((current) => {
      const next = !current
      if (next && requestedBonusSpend === 0) {
        setRequestedBonusSpend(maxBonusSpend)
      }
      return next
    })
  }

  const submitOrder = () => {
    if (submitGuard.current || isSubmitting) return

    setSubmitAttempted(true)
    setSubmitError('')
    if (
      checkoutHasErrors ||
      !selectedSlot ||
      !substitutionPolicy ||
      !paymentMethod ||
      !address ||
      cartItems.length === 0
    ) {
      document
        .querySelector<HTMLElement>('.checkout-error-summary')
        ?.focus()
      return
    }

    submitGuard.current = true
    setSubmitting(true)

    try {
      const createdAt = new Date()
      const order = createOrderSnapshot({
        id: createDemoOrderId(createdAt),
        createdAt: createdAt.toISOString(),
        cart,
        address: {
          ...address,
          deliveryTime: `${selectedSlot.dayLabel}, ${selectedSlot.timeLabel}`,
        },
        deliverySlot: selectedSlot,
        recipient,
        substitutionPolicy,
        paymentMethod,
        courierComment: courierComment.trim(),
        electronicReceipt: electronicReceipts,
        totals,
        bonusBalanceBefore: checkoutBonusBalance,
      })

      placeOrder(order)
      navigate(`/orders/${encodeURIComponent(order.id)}/success`, {
        replace: true,
      })
      window.requestAnimationFrame(() => clearOrderedCart(order.id))
    } catch {
      submitGuard.current = false
      setSubmitting(false)
      setSubmitError('Не удалось оформить заказ. Проверьте корзину и повторите.')
    }
  }

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <main className="screen screen--checkout">
        <PageHeader title="Оформление" backTo="/cart" showCart={false} />
        <section className="checkout-empty" aria-labelledby="checkout-empty-title">
          <PackageCheck aria-hidden="true" />
          <h2 id="checkout-empty-title">Нечего оформлять</h2>
          <p>Добавьте товары в корзину, чтобы выбрать доставку и оплату.</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="screen screen--checkout has-checkout-action">
      <PageHeader title="Оформление" backTo="/cart" showCart={false} />

      <div className="checkout-demo-note" role="note">
        Это демонстрация: данные, заказ и платёжные запросы никуда не
        отправляются.
      </div>

      {submitAttempted && checkoutHasErrors && (
        <div
          className="checkout-error-summary"
          role="alert"
          tabIndex={-1}
        >
          <strong>Проверьте данные заказа</strong>
          <span>Незаполненные блоки отмечены ниже.</span>
        </div>
      )}

      {undeliverableItems.length > 0 && (
        <div className="delivery-blocker" role="alert">
          <AlertTriangle aria-hidden="true" />
          <span>
            <strong>Есть товары только для покупки в магазине</strong>
            <small>
              {undeliverableItems
                .map(({ product }) => product.name)
                .join(', ')}
              . Удалите их из корзины.
            </small>
          </span>
        </div>
      )}

      {submitError && (
        <div className="checkout-error-summary" role="alert">
          <strong>{submitError}</strong>
        </div>
      )}

      <section className="checkout-section" aria-labelledby="checkout-address-title">
        <div className="checkout-section__heading">
          <span className="checkout-section__icon">
            <MapPin aria-hidden="true" />
          </span>
          <div>
            <h2 id="checkout-address-title">Адрес</h2>
            <p>Проверьте адрес перед оформлением</p>
          </div>
        </div>
        <button
          type="button"
          className="checkout-address"
          onClick={openAddress}
          aria-describedby={submitAttempted && errors.address ? 'address-error' : undefined}
        >
          <span>
            <strong>{address?.street ?? 'Выберите адрес доставки'}</strong>
            <small>
              {address?.city ?? 'Адрес сохранится после подтверждения'}
            </small>
          </span>
          <span>{address ? 'Изменить' : 'Выбрать'}</span>
          <ChevronRight aria-hidden="true" />
        </button>
        {submitAttempted && errors.address && (
          <p className="field-error" id="address-error">
            {errors.address}
          </p>
        )}
      </section>

      <section className="checkout-section" aria-labelledby="recipient-title">
        <div className="checkout-section__heading">
          <span className="checkout-section__icon">
            <UserRound aria-hidden="true" />
          </span>
          <div>
            <h2 id="recipient-title">Получатель</h2>
            <p>Данные получателя</p>
          </div>
        </div>
        <div className="recipient-card">
          <strong>{profile.name}</strong>
          <span>{profile.phone}</span>
        </div>
        <label className="switch-row">
          <span>
            <strong>Получит другой человек</strong>
            <small>Укажите имя и телефон получателя</small>
          </span>
          <input
            type="checkbox"
            checked={otherRecipient}
            onChange={(event) => setOtherRecipient(event.target.checked)}
          />
          <i aria-hidden="true" />
        </label>
        {otherRecipient && (
          <div className="recipient-fields">
            <label htmlFor="other-recipient-name">Имя получателя</label>
            <input
              id="other-recipient-name"
              value={otherRecipientData.name}
              autoComplete="off"
              onChange={(event) =>
                setOtherRecipientData((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
            <label htmlFor="other-recipient-phone">Телефон</label>
            <input
              id="other-recipient-phone"
              value={otherRecipientData.phone}
              inputMode="tel"
              autoComplete="off"
              onChange={(event) =>
                setOtherRecipientData((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              aria-describedby={
                submitAttempted && errors.recipient
                  ? 'recipient-error'
                  : 'recipient-demo-note'
              }
            />
            <small id="recipient-demo-note">
              Проверьте имя и телефон получателя.
            </small>
          </div>
        )}
        {submitAttempted && errors.recipient && (
          <p className="field-error" id="recipient-error">
            {errors.recipient}
          </p>
        )}
      </section>

      <section className="checkout-section" aria-labelledby="delivery-time-title">
        <div className="checkout-section__heading">
          <span className="checkout-section__icon">
            <CalendarDays aria-hidden="true" />
          </span>
          <div>
            <h2 id="delivery-time-title">Интервал доставки</h2>
            <p>Сборка займёт примерно {DEMO_RULES.assemblyTime}</p>
          </div>
        </div>
        <div className="delivery-day-tabs" role="group" aria-label="День доставки">
          {dayOptions.map((day) => (
            <button
              type="button"
              key={day.key}
              className={selectedDay === day.key ? 'is-active' : undefined}
              aria-pressed={selectedDay === day.key}
              onClick={() => selectDay(day.key)}
            >
              <strong>{day.label}</strong>
              <span>{day.date}</span>
            </button>
          ))}
        </div>
        <div
          className="delivery-time-grid"
          role="group"
          aria-label="Время доставки"
          aria-describedby={
            submitAttempted && errors.deliverySlot
              ? 'delivery-slot-error'
              : undefined
          }
        >
          {deliverySlots
            .filter((slot) => getDayKey(slot) === selectedDay)
            .map((slot) => {
              const active = selectedSlot?.id === slot.id
              return (
                <button
                  type="button"
                  key={slot.id}
                  className={active ? 'is-active' : undefined}
                  aria-pressed={active}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <Clock3 aria-hidden="true" />
                  <span>{slot.timeLabel}</span>
                  {!slot.available && <small>Недоступно</small>}
                </button>
              )
            })}
        </div>
        {submitAttempted && errors.deliverySlot && (
          <p className="field-error" id="delivery-slot-error">
            {errors.deliverySlot}
          </p>
        )}
      </section>

      <fieldset
        className="checkout-section checkout-fieldset"
        aria-describedby={
          submitAttempted && errors.substitutionPolicy
            ? 'substitution-error'
            : undefined
        }
      >
        <legend>
          <span className="checkout-section__icon">
            <PackageCheck aria-hidden="true" />
          </span>
          <span>
            <strong>Если товара не будет</strong>
            <small>Выберите один вариант до оформления</small>
          </span>
        </legend>
        <div className="choice-list">
          {substitutionOptions.map((option) => (
            <label key={option.value} className="choice-card">
              <input
                type="radio"
                name="substitution-policy"
                value={option.value}
                checked={substitutionPolicy === option.value}
                onChange={() => setSubstitutionPolicy(option.value)}
              />
              <span className="choice-card__mark" aria-hidden="true">
                <Check />
              </span>
              <span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </div>
        {submitAttempted && errors.substitutionPolicy && (
          <p className="field-error" id="substitution-error">
            {errors.substitutionPolicy}
          </p>
        )}
      </fieldset>

      <section className="checkout-section" aria-labelledby="courier-comment-title">
        <div className="checkout-section__heading">
          <span className="checkout-section__icon">
            <MessageSquareText aria-hidden="true" />
          </span>
          <div>
            <h2 id="courier-comment-title">Комментарий курьеру</h2>
            <p>Необязательное поле</p>
          </div>
        </div>
        <label className="comment-field" htmlFor="courier-comment">
          <span className="sr-only">Комментарий курьеру</span>
          <textarea
            id="courier-comment"
            rows={3}
            maxLength={DEMO_RULES.commentMaxLength}
            value={courierComment}
            onChange={(event) => setCourierComment(event.target.value)}
            placeholder="Например, позвоните перед доставкой"
          />
          <small aria-live="polite">
            {courierComment.length}/{DEMO_RULES.commentMaxLength}
          </small>
        </label>
      </section>

      <fieldset
        className="checkout-section checkout-fieldset"
        aria-describedby={
          submitAttempted && errors.paymentMethod ? 'payment-error' : undefined
        }
      >
        <legend>
          <span className="checkout-section__icon">
            <Banknote aria-hidden="true" />
          </span>
          <span>
            <strong>Оплата</strong>
            <small>Выберите способ для заказа</small>
          </span>
        </legend>
        <div className="choice-list">
          {paymentOptions.map((option) => {
            const Icon = option.icon
            return (
              <label key={option.value} className="choice-card choice-card--icon">
                <input
                  type="radio"
                  name="payment-method"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={() => setPaymentMethod(option.value)}
                />
                <Icon aria-hidden="true" />
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
                <span className="choice-card__mark" aria-hidden="true">
                  <Check />
                </span>
              </label>
            )
          })}
        </div>
        {submitAttempted && errors.paymentMethod && (
          <p className="field-error" id="payment-error">
            {errors.paymentMethod}
          </p>
        )}
      </fieldset>

      <section className="checkout-section bonus-redemption" aria-labelledby="bonus-title">
        <div className="checkout-section__heading">
          <span className="checkout-section__icon">
            <Gift aria-hidden="true" />
          </span>
          <div>
            <h2 id="bonus-title">Табрис Бонус</h2>
            <p>Доступно {formatBonusCount(checkoutBonusBalance)}</p>
          </div>
        </div>
        <label className="switch-row">
          <span>
            <strong>Применить бонусы</strong>
            <small>Можно списать до {formatBonusCount(maxBonusSpend)}</small>
          </span>
          <input
            type="checkbox"
            checked={applyBonus}
            disabled={maxBonusSpend === 0}
            onChange={toggleBonus}
          />
          <i aria-hidden="true" />
        </label>
        {applyBonus && (
          <label className="bonus-input" htmlFor="bonus-spend">
            <span>Списать</span>
            <span>
              <input
                id="bonus-spend"
                type="number"
                inputMode="decimal"
                min={0}
                max={maxBonusSpend}
                step={0.01}
                value={requestedBonusSpend}
                onChange={(event) => {
                  const value = Number(event.target.value)
                  setRequestedBonusSpend(
                    Number.isFinite(value)
                      ? roundBonusAmount(
                          Math.min(maxBonusSpend, Math.max(0, value)),
                        )
                      : 0,
                  )
                }}
              />
              <small>{formatBonusNoun(requestedBonusSpend)}</small>
            </span>
          </label>
        )}
        <dl className="bonus-result">
          <div>
            <dt>Будет начислено</dt>
            <dd>+{formatBonusCount(totals.bonusEarned)}</dd>
          </div>
          <div>
            <dt>Остаток после списания</dt>
            <dd>
              {formatBonusCount(
                checkoutBonusBalance - totals.bonusSpent,
              )}
            </dd>
          </div>
        </dl>
        <p className="demo-rule-note">
          Акционные товары не участвуют в начислении. Доставка не оплачивается
          бонусами.
        </p>
      </section>

      <section className="checkout-section order-summary" aria-labelledby="checkout-total-title">
        <h2 id="checkout-total-title">Итог заказа</h2>
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
            <dt>Списано бонусов</dt>
            <dd>−{formatPrice(totals.bonusSpent)} ₽</dd>
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
          <div>
            <dt>Начислим бонусов</dt>
            <dd>+{formatPrice(totals.bonusEarned)}</dd>
          </div>
        </dl>
        {!totals.minimumOrderReached && (
          <p className="minimum-order-note" id="minimum-order-error">
            До минимальной суммы {formatPrice(DEMO_RULES.minimumOrder)} ₽ не
            хватает{' '}
            {formatPrice(
              Math.max(0, DEMO_RULES.minimumOrder - totals.merchandiseSubtotal),
            )}{' '}
            ₽.
          </p>
        )}
      </section>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения «Табрис». Создан для
        демонстрации.
      </p>

      <AppPortal>
        <div className="checkout-action-bar">
          <span>
            <small>{formatProductCount(totals.itemCount)}</small>
            <strong>{formatPrice(totals.payableTotal)} ₽</strong>
          </span>
          <button
            type="button"
            className="primary-button"
            disabled={isSubmitting || undeliverableItems.length > 0}
            aria-describedby={
              !totals.minimumOrderReached ? 'minimum-order-error' : undefined
            }
            onClick={submitOrder}
          >
            {isSubmitting ? 'Оформляем…' : 'Оформить заказ'}
          </button>
        </div>
      </AppPortal>
    </main>
  )
}
