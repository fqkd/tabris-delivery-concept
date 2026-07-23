import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  deliveryCities,
  isDeliveryCity,
} from '../config/demoRules.ts'

describe('delivery cities', () => {
  it('keeps the supported cities in one exact ordered source', () => {
    assert.deepEqual(deliveryCities, [
      'Краснодар',
      'Анапа',
      'Геленджик',
      'Новороссийск',
      'Сочи',
    ])
    assert.equal(new Set(deliveryCities).size, 5)
  })

  it('accepts supported cities and rejects unavailable ones', () => {
    assert.ok(deliveryCities.every(isDeliveryCity))
    assert.equal(isDeliveryCity('Ставрополь'), false)
  })
})
