import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  deliveryCities,
  isDeliveryCity,
} from '../config/demoRules.ts'
import { shopReducer } from '../context/shopReducer.ts'
import { createDefaultPersistedState } from './storage.ts'

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

  it('clears the dependent address when the city changes', () => {
    const withAddress = shopReducer(createDefaultPersistedState(), {
      type: 'CONFIRM_ADDRESS',
      address: {
        city: 'Краснодар',
        street: 'ул. Демонстрационная, 12',
        deliveryTime: 'Сегодня, 18:00–19:00',
      },
    })
    const changed = shopReducer(withAddress, {
      type: 'SELECT_DELIVERY_CITY',
      city: 'Сочи',
    })

    assert.equal(changed.deliveryCity, 'Сочи')
    assert.equal(changed.address, null)
  })

  it('keeps the address when the selected city does not change', () => {
    const withAddress = shopReducer(createDefaultPersistedState(), {
      type: 'CONFIRM_ADDRESS',
      address: {
        city: 'Краснодар',
        street: 'ул. Демонстрационная, 12',
        deliveryTime: 'Сегодня, 18:00–19:00',
      },
    })
    const unchanged = shopReducer(withAddress, {
      type: 'SELECT_DELIVERY_CITY',
      city: 'Краснодар',
    })

    assert.equal(unchanged, withAddress)
  })
})
