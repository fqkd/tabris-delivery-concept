import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { DEMO_RULES, defaultProfile } from '../config/demoRules.ts'
import { createDemoTrackingOrder } from '../data/demoOrder.ts'
import { shopReducer } from '../context/shopReducer.ts'
import { calculateOrderTotals } from './cart.ts'
import {
  buildTrackingTimeline,
  createOrderSnapshot,
} from './order.ts'
import {
  createDefaultPersistedState,
  loadPersistedState,
} from './storage.ts'

const createPlacedOrder = (id: string, createdAt: string) => {
  const cart = { 'striploin-steak': 1 }
  return createOrderSnapshot({
    id,
    createdAt,
    cart,
    address: {
      city: 'Сочи',
      street: 'ул. Демонстрационная, 12',
      deliveryTime: 'Завтра, 10:00–12:00',
    },
    deliverySlot: {
      id: '2026-07-25-1000',
      dateKey: '2026-07-25',
      dayLabel: 'Завтра',
      dateLabel: '25 июля',
      timeLabel: '10:00–12:00',
      available: true,
    },
    recipient: defaultProfile,
    substitutionPolicy: 'similar',
    paymentMethod: 'card',
    courierComment: '',
    electronicReceipt: true,
    totals: calculateOrderTotals(cart, 0, DEMO_RULES.initialBonusBalance),
    bonusBalanceBefore: DEMO_RULES.initialBonusBalance,
  })
}

describe('order state consistency', () => {
  it('creates a new order at the placed stage without courier ETA', () => {
    const order = createPlacedOrder(
      'ДЕМО-NEW',
      '2026-07-24T09:00:00.000Z',
    )
    const timeline = buildTrackingTimeline(order)

    assert.equal(order.status, 'placed')
    assert.deepEqual(order.statusEvents, [
      {
        status: 'placed',
        occurredAt: '2026-07-24T09:00:00.000Z',
      },
    ])
    assert.equal(order.eta, undefined)
    assert.equal(timeline[0].state, 'current')
    assert.ok(timeline[0].time)
    assert.ok(timeline.slice(1).every((step) => step.state === 'upcoming'))
    assert.ok(timeline.slice(1).every((step) => step.time === undefined))
  })

  it('keeps demo tracking events chronological and future stages untimed', () => {
    const order = createDemoTrackingOrder(
      new Date('2026-07-24T10:00:00.000Z'),
    )
    const timeline = buildTrackingTimeline(order)
    const occurredAt = order.statusEvents.map((event) =>
      Date.parse(event.occurredAt),
    )

    assert.equal(order.status, 'delivering')
    assert.deepEqual(order.eta, { minMinutes: 12, maxMinutes: 18 })
    assert.deepEqual(occurredAt, [...occurredAt].sort((a, b) => a - b))
    assert.ok(timeline.slice(0, 3).every((step) => step.state === 'complete'))
    assert.equal(timeline[3].state, 'current')
    assert.ok(timeline.slice(0, 4).every((step) => Boolean(step.time)))
    assert.equal(timeline[4].state, 'upcoming')
    assert.equal(timeline[4].time, undefined)
  })

  it('keeps prepared demo event times stable across reloads on the same day', () => {
    const firstLoad = createDemoTrackingOrder(
      new Date('2026-07-24T10:00:00.000Z'),
    )
    const secondLoad = createDemoTrackingOrder(
      new Date('2026-07-24T10:25:00.000Z'),
    )

    assert.deepEqual(secondLoad.statusEvents, firstLoad.statusEvents)
    assert.equal(
      secondLoad.courierLocationUpdatedAt,
      firstLoad.courierLocationUpdatedAt,
    )
  })

  it('refuses to create a delivery order with alcohol from legacy storage', () => {
    const cart = { 'sparkling-asti': 1 }
    const input = {
      id: 'ДЕМО-BLOCKED',
      createdAt: '2026-07-24T09:00:00.000Z',
      cart,
      address: {
        city: 'Краснодар',
        street: 'ул. Демонстрационная, 12',
        deliveryTime: 'Завтра, 10:00–12:00',
      },
      deliverySlot: {
        id: '2026-07-25-1000',
        dateKey: '2026-07-25',
        dayLabel: 'Завтра',
        dateLabel: '25 июля',
        timeLabel: '10:00–12:00',
        available: true,
      },
      recipient: defaultProfile,
      substitutionPolicy: 'similar' as const,
      paymentMethod: 'card' as const,
      courierComment: '',
      electronicReceipt: true,
      totals: calculateOrderTotals(
        cart,
        0,
        DEMO_RULES.initialBonusBalance,
      ),
      bonusBalanceBefore: DEMO_RULES.initialBonusBalance,
    }

    assert.throws(
      () => createOrderSnapshot(input),
      /недоступные для доставки/,
    )
  })

  it('keeps multiple orders and the previous order addressable by id', () => {
    const first = createPlacedOrder(
      'ДЕМО-FIRST',
      '2026-07-24T09:00:00.000Z',
    )
    const second = createPlacedOrder(
      'ДЕМО-SECOND',
      '2026-07-24T10:00:00.000Z',
    )
    const afterFirst = shopReducer(createDefaultPersistedState(), {
      type: 'SAVE_ORDER',
      order: first,
    })
    const afterSecond = shopReducer(afterFirst, {
      type: 'SAVE_ORDER',
      order: second,
    })

    assert.equal(afterSecond.orders.length, 2)
    assert.equal(afterSecond.lastOrderId, second.id)
    assert.equal(
      afterSecond.orders.find((order) => order.id === first.id)?.id,
      first.id,
    )
  })

  it('does not save the same order or deduct its bonuses twice', () => {
    const cart = { 'striploin-steak': 1 }
    const totals = calculateOrderTotals(
      cart,
      500,
      DEMO_RULES.initialBonusBalance,
    )
    const base = createPlacedOrder(
      'ДЕМО-ONCE',
      '2026-07-24T09:00:00.000Z',
    )
    const order = createOrderSnapshot({
      id: base.id,
      createdAt: base.createdAt,
      cart,
      address: base.address,
      deliverySlot: base.deliverySlot,
      recipient: base.recipient,
      substitutionPolicy: base.substitutionPolicy,
      paymentMethod: base.paymentMethod,
      courierComment: '',
      electronicReceipt: true,
      totals,
      bonusBalanceBefore: DEMO_RULES.initialBonusBalance,
    })
    const afterFirst = shopReducer(createDefaultPersistedState(), {
      type: 'SAVE_ORDER',
      order,
    })
    const afterSecond = shopReducer(afterFirst, {
      type: 'SAVE_ORDER',
      order,
    })

    assert.equal(afterSecond.orders.length, 1)
    assert.equal(afterSecond.bonusBalance, order.bonusBalanceAfter)
  })

  it('migrates the former lastOrder snapshot without losing it', () => {
    const order = createPlacedOrder(
      'ДЕМО-LEGACY',
      '2026-07-24T09:00:00.000Z',
    )
    const { statusEvents: _statusEvents, ...legacyOrder } = {
      ...order,
      status: 'assembling' as const,
    }
    const values = new Map<string, string>()
    values.set(
      'tabris-concept-state',
      JSON.stringify({
        version: 3,
        data: {
          ...createDefaultPersistedState(),
          orders: undefined,
          lastOrder: legacyOrder,
          lastOrderId: undefined,
        },
      }),
    )
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: storage,
    })
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: storage,
    })

    const migrated = loadPersistedState()

    assert.equal(migrated.orders.length, 1)
    assert.equal(migrated.orders[0].id, order.id)
    assert.equal(migrated.orders[0].status, 'placed')
    assert.equal(migrated.lastOrderId, order.id)
  })
})
