import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { shopReducer } from '../context/shopReducer.ts'
import {
  createDefaultPersistedState,
  loadPersistedState,
  savePersistedState,
} from './storage.ts'

const installMemoryStorage = () => {
  const values = new Map<string, string>()
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
}

describe('persisted shop state', () => {
  it('restores favorites after a page reload', () => {
    installMemoryStorage()
    const favorited = shopReducer(createDefaultPersistedState(), {
      type: 'TOGGLE_FAVORITE',
      productId: 'syrniki',
    })

    savePersistedState(favorited)
    const restored = loadPersistedState()

    assert.deepEqual(restored.favoriteIds, ['syrniki'])
  })

  it('restores a selected city without carrying an old address into it', () => {
    installMemoryStorage()
    const changed = shopReducer(createDefaultPersistedState(), {
      type: 'SELECT_DELIVERY_CITY',
      city: 'Сочи',
    })

    savePersistedState(changed)
    const restored = loadPersistedState()

    assert.equal(restored.deliveryCity, 'Сочи')
    assert.equal(restored.address, null)
  })
})
