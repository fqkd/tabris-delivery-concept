import { getCartItems } from './cart'
import { roundBonusAmount } from './bonus'
import type {
  CartState,
  DeliveryAddress,
  DeliverySlot,
  DemoProfile,
  OrderSnapshot,
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
}

export const validateCheckout = (
  input: CheckoutInput,
  totals: OrderTotals,
) => ({
  address: input.address ? '' : 'Выберите адрес доставки',
  recipient:
    input.recipient.name.trim().length >= 2 && input.recipient.phone.trim()
      ? ''
      : 'Укажите демонстрационные данные получателя',
  deliverySlot: input.deliverySlot ? '' : 'Выберите интервал доставки',
  substitutionPolicy: input.substitutionPolicy
    ? ''
    : 'Выберите правило замены товаров',
  paymentMethod: input.paymentMethod ? '' : 'Выберите способ оплаты',
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
): OrderSnapshot => ({
  id: input.id,
  createdAt: input.createdAt,
  status: 'assembling',
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
})

export type TrackingStep = {
  id: string
  label: string
  description: string
  time?: string
  state: 'complete' | 'current' | 'upcoming'
}

export const buildTrackingTimeline = (order: OrderSnapshot): TrackingStep[] => {
  const steps: Omit<TrackingStep, 'state'>[] = [
    {
    id: 'placed',
    label: 'Заказ оформлен',
    description: 'Мы получили заказ и проверили данные',
    time: new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(order.createdAt)),
  },
  {
    id: 'assembling',
    label: 'Собираем заказ',
    description: 'Подбираем свежие продукты и готовые блюда',
  },
  {
    id: 'courier',
    label: 'Передали курьеру',
    description: 'Заказ будет бережно упакован для доставки',
  },
  {
    id: 'delivering',
    label: 'Доставляем',
    description: 'Условный маршрут появится на этом этапе',
  },
  {
    id: 'delivered',
    label: 'Заказ доставлен',
    description: 'Всё готово — приятного аппетита',
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

  return steps.map((step, index) => ({
    ...step,
    state:
      index < currentIndex
        ? 'complete'
        : index === currentIndex
          ? 'current'
          : 'upcoming',
  }))
}
