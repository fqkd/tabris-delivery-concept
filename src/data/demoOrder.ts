import { DEMO_RULES, defaultProfile } from '../config/demoRules.ts'
import { calculateOrderTotals } from '../lib/cart.ts'
import { toLocalDateKey } from '../lib/deliveryDates.ts'
import { createOrderSnapshot } from '../lib/order.ts'
import type { OrderSnapshot } from '../types'

export const DEMO_TRACKING_ORDER_ID = 'ДЕМО-230930'

const minutesBefore = (date: Date, minutes: number) =>
  new Date(date.getTime() - minutes * 60_000).toISOString()

const formatHour = (hour: number) =>
  `${String((hour + 24) % 24).padStart(2, '0')}:00`

export const createDemoTrackingOrder = (
  now = new Date(),
): OrderSnapshot => {
  const cart = {
    'salad-roast-beef': 1,
    'berry-mors': 1,
  }
  const totals = calculateOrderTotals(
    cart,
    0,
    DEMO_RULES.initialBonusBalance,
  )
  const dateKey = toLocalDateKey(now)
  const timeLabel = `${formatHour(now.getHours())}–${formatHour(
    now.getHours() + 2,
  )}`
  const createdAt = minutesBefore(now, 100)
  const order = createOrderSnapshot({
    id: DEMO_TRACKING_ORDER_ID,
    createdAt,
    cart,
    address: {
      city: 'Краснодар',
      street: 'ул. Демонстрационная, 12',
      deliveryTime: `Сегодня, ${timeLabel}`,
    },
    deliverySlot: {
      id: `${dateKey}-demo`,
      dateKey,
      dayLabel: 'Сегодня',
      dateLabel: new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
      }).format(now),
      timeLabel,
      available: true,
    },
    recipient: defaultProfile,
    substitutionPolicy: 'contact',
    paymentMethod: 'card',
    courierComment: '',
    electronicReceipt: true,
    totals,
    bonusBalanceBefore: DEMO_RULES.initialBonusBalance,
  })

  return {
    ...order,
    status: 'delivering',
    statusEvents: [
      { status: 'placed', occurredAt: createdAt },
      { status: 'assembling', occurredAt: minutesBefore(now, 80) },
      { status: 'courier', occurredAt: minutesBefore(now, 20) },
      { status: 'delivering', occurredAt: minutesBefore(now, 12) },
    ],
    eta: {
      minMinutes: 12,
      maxMinutes: 18,
    },
    courierLocationUpdatedAt: minutesBefore(now, 2),
  }
}

export const demoTrackingOrder = createDemoTrackingOrder()
