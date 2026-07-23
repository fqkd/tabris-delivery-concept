import type { DeliverySlot } from '../types'

type SlotTemplate = {
  timeLabel: string
  available: boolean
}

const slotTemplates: SlotTemplate[][] = [
  [
    { timeLabel: '17:00–18:00', available: false },
    { timeLabel: '18:00–19:00', available: true },
    { timeLabel: '19:00–20:00', available: true },
  ],
  [
    { timeLabel: '10:00–12:00', available: true },
    { timeLabel: '12:00–14:00', available: true },
    { timeLabel: '18:00–20:00', available: true },
  ],
  [
    { timeLabel: '10:00–12:00', available: true },
    { timeLabel: '12:00–14:00', available: false },
    { timeLabel: '16:00–18:00', available: true },
  ],
]

const capitalize = (value: string) =>
  value ? `${value[0].toLocaleUpperCase('ru-RU')}${value.slice(1)}` : value

export const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const isLocalDateKey = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const [, year, month, day] = match
  const parsed = new Date(Number(year), Number(month) - 1, Number(day))
  return toLocalDateKey(parsed) === value
}

export const parseLocalDateKey = (value: string) => {
  if (!isLocalDateKey(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const addLocalDays = (date: Date, offset: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset)

export const formatDeliveryDayLabel = (date: Date, offset: number) => {
  if (offset === 0) return 'Сегодня'
  if (offset === 1) return 'Завтра'
  return capitalize(
    new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date),
  )
}

export const formatDeliveryDateLabel = (date: Date, baseDate: Date) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    ...(date.getFullYear() === baseDate.getFullYear()
      ? {}
      : { year: 'numeric' as const }),
  }).format(date)

const getCalendarDayOffset = (date: Date, baseDate: Date) => {
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const baseUtc = Date.UTC(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
  )
  return Math.round((dateUtc - baseUtc) / 86_400_000)
}

export const formatSavedDeliveryDate = (
  slot: Pick<DeliverySlot, 'dateKey' | 'dayLabel' | 'dateLabel'>,
  baseDate = new Date(),
) => {
  const date = parseLocalDateKey(slot.dateKey)
  if (!date) {
    return { dayLabel: slot.dayLabel, dateLabel: slot.dateLabel }
  }
  const offset = getCalendarDayOffset(date, baseDate)
  return {
    dayLabel: formatDeliveryDayLabel(date, offset),
    dateLabel: formatDeliveryDateLabel(date, baseDate),
  }
}

export const createDeliverySlots = (baseDate = new Date()): DeliverySlot[] =>
  slotTemplates.flatMap((templates, offset) => {
    const date = addLocalDays(baseDate, offset)
    const dateKey = toLocalDateKey(date)
    const dayLabel = formatDeliveryDayLabel(date, offset)
    const dateLabel = formatDeliveryDateLabel(date, baseDate)

    return templates.map((template) => ({
      id: `${dateKey}-${template.timeLabel.slice(0, 5).replace(':', '')}`,
      dateKey,
      dayLabel,
      dateLabel,
      timeLabel: template.timeLabel,
      available: template.available,
    }))
  })

export const getNearestDeliveryTimeLabel = (baseDate = new Date()) => {
  const slot = createDeliverySlots(baseDate).find((item) => item.available)
  return slot ? `${slot.dayLabel}, ${slot.timeLabel}` : 'Уточним при оформлении'
}
