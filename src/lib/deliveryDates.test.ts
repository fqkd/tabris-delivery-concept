import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  createDeliverySlots,
  formatSavedDeliveryDate,
  isLocalDateKey,
  toLocalDateKey,
} from './deliveryDates.ts'

const uniqueDays = (date: Date) =>
  Array.from(
    new Map(
      createDeliverySlots(date).map((slot) => [slot.dateKey, slot]),
    ).values(),
  )

describe('dynamic delivery dates', () => {
  it('crosses a month boundary in local calendar time', () => {
    const days = uniqueDays(new Date(2026, 6, 31, 12))

    assert.deepEqual(
      days.map((day) => day.dateKey),
      ['2026-07-31', '2026-08-01', '2026-08-02'],
    )
    assert.equal(days[0].dayLabel, 'Сегодня')
    assert.equal(days[1].dayLabel, 'Завтра')
  })

  it('crosses a year boundary and includes the new year in the label', () => {
    const days = uniqueDays(new Date(2026, 11, 31, 12))

    assert.equal(days[1].dateKey, '2027-01-01')
    assert.match(days[1].dateLabel, /2027/)
  })

  it('creates stable unique slot identifiers from canonical dates', () => {
    const slots = createDeliverySlots(new Date(2026, 1, 10, 12))
    assert.equal(new Set(slots.map((slot) => slot.id)).size, slots.length)
    assert.ok(slots.every((slot) => slot.id.startsWith(slot.dateKey)))
  })

  it('recalculates relative wording while preserving the saved calendar date', () => {
    const slot = createDeliverySlots(new Date(2026, 6, 23, 12))[0]
    const laterLabel = formatSavedDeliveryDate(
      slot,
      new Date(2026, 6, 25, 12),
    )

    assert.equal(laterLabel.dateLabel, '23 июля')
    assert.notEqual(laterLabel.dayLabel, 'Сегодня')
  })

  it('validates real local date keys, including leap years', () => {
    assert.equal(isLocalDateKey('2028-02-29'), true)
    assert.equal(isLocalDateKey('2027-02-29'), false)
    assert.equal(toLocalDateKey(new Date(2027, 0, 1)), '2027-01-01')
  })
})
