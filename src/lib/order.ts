import { getCartItems } from './cart.ts'
import { roundBonusAmount } from './bonus.ts'
import { getUndeliverableCartItems } from './deliveryAvailability.ts'
import type {
  CartState,
  DeliveryAddress,
  DeliverySlot,
  DemoProfile,
  OrderSnapshot,
  OrderStatus,
  OrderTotals,
  PaymentMethod,
  SubstitutionPolicy,
} from '../types'

export type CheckoutInput = {
  address: DeliveryAddress | null
  recipient: DemoProfile
  deliverySlot: DeliverySlot | null
  substitutionPolicy: SubstitutionPolicy | null
  paymentMethod: PaymentMethod | null
  deliveryIssue?: string
}

export const validateCheckout = (
  input: CheckoutInput,
  totals: OrderTotals,
) => ({
  address: input.address ? '' : 'Выберите адрес доставки',
  recipient:
    input.recipient.name.trim().length >= 2 && input.recipient.phone.trim()
      ? ''
      : 'Укажите имя и телефон получателя',
  deliverySlot: input.deliverySlot ? '' : 'Выберите интервал доставки',
  substitutionPolicy: input.substitutionPolicy
    ? ''
    : 'Выберите правило замены товаров',
  paymentMethod: input.paymentMethod ? '' : 'Выберите способ оплаты',
  delivery: input.deliveryIssue ?? '',
  minimumOrder: totals.minimumOrderReached
    ? ''
    : 'Минимальная сумма товаров ещё не достигнута',
})

export const hasCheckoutErrors = (
  errors: ReturnType<typeof validateCheckout>,
) => Object.values(errors).some(Boolean)

export const createDemoOrderId = (createdAt: Date) => {
  const day = String(createdAt.getDate()).padStart(2, '0')
  const hour = String(createdAt.getHours()).padStart(2, '0')
  const minute = String(createdAt.getMinutes()).padStart(2, '0')
  const second = String(createdAt.getSeconds()).padStart(2, '0')
  const millisecond = String(createdAt.getMilliseconds()).padStart(3, '0')
  return `ДЕМО-${day}${hour}${minute}${second}${millisecond}`
}

type CreateOrderSnapshotInput = {
  id: string
  createdAt: string
  cart: CartState
  address: DeliveryAddress
  deliverySlot: DeliverySlot
  recipient: DemoProfile
  substitutionPolicy: SubstitutionPolicy
  paymentMethod: PaymentMethod
  courierComment: string
  electronicReceipt: boolean
  totals: OrderTotals
  bonusBalanceBefore: number
}

export const createOrderSnapshot = (
  input: CreateOrderSnapshotInput,
): OrderSnapshot => {
  if (getUndeliverableCartItems(input.cart, input.address.city).length > 0) {
    throw new Error('Корзина содержит товары, недоступные для доставки')
  }

  return {
  id: input.id,
  createdAt: input.createdAt,
  status: 'placed',
  statusEvents: [
    {
      status: 'placed',
      occurredAt: input.createdAt,
    },
  ],
  address: input.address,
  deliverySlot: input.deliverySlot,
  recipient: input.recipient,
  substitutionPolicy: input.substitutionPolicy,
  paymentMethod: input.paymentMethod,
  courierComment: input.courierComment,
  electronicReceipt: input.electronicReceipt,
  lines: getCartItems(input.cart).map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    image: product.image,
    weight: product.weight,
    unitPrice: product.price,
    oldUnitPrice: product.oldPrice,
    quantity,
  })),
  totals: input.totals,
  bonusBalanceBefore: input.bonusBalanceBefore,
  bonusBalanceAfter: roundBonusAmount(
    Math.max(0, input.bonusBalanceBefore - input.totals.bonusSpent),
  ),
  }
}

export type TrackingStep = {
  id: OrderStatus
  label: string
  description: string
  time?: string
  state: 'complete' | 'current' | 'upcoming'
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  placed: 'Заказ оформлен',
  assembling: 'Собираем заказ',
  courier: 'Передали курьеру',
  delivering: 'Доставляем',
  delivered: 'Заказ доставлен',
}

const formatEventTime = (occurredAt: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(occurredAt))

export const buildTrackingTimeline = (order: OrderSnapshot): TrackingStep[] => {
  const steps: Omit<TrackingStep, 'state' | 'time'>[] = [
    {
      id: 'placed',
      label: orderStatusLabels.placed,
      description: 'Заказ оформлен и ожидает сборки',
    },
    {
      id: 'assembling',
      label: orderStatusLabels.assembling,
      description: 'Подбираем товары и бережно упаковываем их',
    },
    {
      id: 'courier',
      label: orderStatusLabels.courier,
      description: 'Курьер получил заказ в магазине',
    },
    {
      id: 'delivering',
      label: orderStatusLabels.delivering,
      description: 'Курьер едет по указанному адресу',
    },
    {
      id: 'delivered',
      label: orderStatusLabels.delivered,
      description: 'Появится после вручения заказа',
    },
  ]
  const statusOrder: OrderSnapshot['status'][] = [
    'placed',
    'assembling',
    'courier',
    'delivering',
    'delivered',
  ]
  const currentIndex = Math.max(0, statusOrder.indexOf(order.status))

  return steps.map((step, index) => {
    const event = order.statusEvents.find(
      (statusEvent) => statusEvent.status === step.id,
    )

    return {
      ...step,
      ...(event ? { time: formatEventTime(event.occurredAt) } : {}),
      state:
        index < currentIndex
          ? 'complete'
          : index === currentIndex
            ? 'current'
            : 'upcoming',
    }
  })
}
