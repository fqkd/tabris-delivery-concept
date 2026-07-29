import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { dinnerSets } from '../data/dinnerSets.ts'
import {
  calculateDinnerTotal,
  describeDinnerSelection,
  dinnerItemsToCartAdditions,
  getSelectedDinnerItems,
} from './dinner.ts'

describe('dinner set composition', () => {
  it('updates description, composition, quantity, and price after removal', () => {
    const dinnerSet = dinnerSets[0]
    const removedProductId = 'pear-sage-lemonade'
    const selected = getSelectedDinnerItems(dinnerSet, [removedProductId])
    const additions = dinnerItemsToCartAdditions(dinnerSet, [removedProductId])

    assert.equal(selected.some((item) => item.productId === removedProductId), false)
    assert.equal(
      additions.some((item) => item.productId === removedProductId),
      false,
    )
    assert.equal(
      selected.reduce((sum, item) => sum + item.quantity, 0),
      5,
    )
    assert.equal(calculateDinnerTotal(dinnerSet, [removedProductId]), 1_595)
    assert.equal(
      describeDinnerSelection(dinnerSet, [removedProductId]),
      'В наборе: паста, салат и десерт.',
    )
  })
})
