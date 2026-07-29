import { DEMO_RULES, defaultProfile } from '../config/demoRules.ts'
import { calculateOrderTotals } from '../lib/cart.ts'
import { toLocalDateKey } from '../lib/deliveryDates.ts'
import { createOrderSnapshot } from '../lib/order.ts'
import type { OrderSnapshot } from '../types'

export const DEMO_TRACKING_ORDER_ID = 'ДЕМО-230930'

const atLocalTime = (date: Date, hour: number, minute: number) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
  ).toISOString()

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
  const timeLabel = '10:00–12:00'
  const createdAt = atLocalTime(now, 9, 10)
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
      { status: 'assembling', occurredAt: atLocalTime(now, 9, 30) },
      { status: 'courier', occurredAt: atLocalTime(now, 10, 30) },
      { status: 'delivering', occurredAt: atLocalTime(now, 10, 38) },
    ],
    eta: {
      minMinutes: 12,
      maxMinutes: 18,
    },
    courierLocationUpdatedAt: atLocalTime(now, 10, 48),
  }
}

export const demoTrackingOrder = createDemoTrackingOrder()
