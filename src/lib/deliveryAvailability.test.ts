import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { shopReducer } from '../context/shopReducer.ts'
import { getProduct } from '../data/products.ts'
import { calculateProductBonus } from './cart.ts'
import { createDefaultPersistedState, sanitizeCart } from './storage.ts'
import {
  canCheckoutDeliveryCart,
  getDeliveryRestriction,
  getUndeliverableCartItems,
  isAvailableForDelivery,
} from './deliveryAvailability.ts'

describe('delivery availability', () => {
  it('keeps alcohol in the catalog but marks it as store-only', () => {
    const alcohol = getProduct('sparkling-asti')

    assert.ok(alcohol)
    assert.equal(alcohol.categoryId, 'alcohol')
    assert.equal(isAvailableForDelivery(alcohol), false)
    assert.equal(getDeliveryRestriction(alcohol)?.label, 'Только в магазине')
  })

  it('blocks alcohol additions through the shared reducer', () => {
    const defaults = createDefaultPersistedState()
    const afterSingleAdd = shopReducer(defaults, {
      type: 'SET_QUANTITY',
      productId: 'sparkling-asti',
      quantity: 1,
    })
    const afterBatchAdd = shopReducer(defaults, {
      type: 'ADD_CART_ITEMS',
      additions: [
        { productId: 'sparkling-asti', quantity: 1 },
        { productId: 'syrniki', quantity: 1 },
      ],
    })

    assert.deepEqual(afterSingleAdd.cart, {})
    assert.deepEqual(afterBatchAdd.cart, { syrniki: 1 })
  })

  it('preserves a legacy alcohol line so checkout can explain the block', () => {
    const cart = sanitizeCart({
      'sparkling-asti': 1,
      syrniki: 2,
    })
    const blocked = getUndeliverableCartItems(cart, 'Краснодар')

    assert.deepEqual(cart, { 'sparkling-asti': 1, syrniki: 2 })
    assert.equal(canCheckoutDeliveryCart(cart, 'Краснодар'), false)
    assert.equal(blocked.length, 1)
    assert.equal(blocked[0].restriction.code, 'store-only')
  })

  it('allows a legacy blocked item to be removed but not increased', () => {
    const state = {
      ...createDefaultPersistedState(),
      cart: { 'sparkling-asti': 1 },
    }
    const increased = shopReducer(state, {
      type: 'SET_QUANTITY',
      productId: 'sparkling-asti',
      quantity: 2,
    })
    const removed = shopReducer(state, {
      type: 'SET_QUANTITY',
      productId: 'sparkling-asti',
      quantity: 0,
    })

    assert.deepEqual(increased.cart, { 'sparkling-asti': 1 })
    assert.deepEqual(removed.cart, {})
  })

  it('does not promise bonus accrual for an unavailable product', () => {
    const unavailable = getProduct('artisan-bread')

    assert.ok(unavailable)
    assert.equal(unavailable.unavailable, true)
    assert.equal(calculateProductBonus(unavailable), 0)
  })
})
