import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { catalogCategories } from '../data/catalogCategories.ts'
import { products } from '../data/products.ts'
import { defaultFilters } from '../config/demoRules.ts'
import {
  filterProducts,
  getCategoryProductCounts,
} from './catalog.ts'

describe('catalog data integrity', () => {
  it('keeps all category counts derived from the single product source', () => {
    const counts = getCategoryProductCounts(products)

    assert.equal(catalogCategories.length, 21)
    assert.equal(products.length, 43)
    assert.equal(
      [...counts.values()].reduce((sum, count) => sum + count, 0),
      products.length,
    )
    assert.ok([...counts.values()].every((count) => count >= 2 && count <= 3))
  })

  it('assigns a unique existing local image to every current product', () => {
    const imagePaths = products.map((product) => product.image)
    const imageFiles = imagePaths.map((imagePath) =>
      join(process.cwd(), 'public', imagePath),
    )

    assert.equal(new Set(imagePaths).size, products.length)
    assert.ok(
      imagePaths.every((imagePath, index) =>
        Boolean(
          imagePath.startsWith('/images/products/') &&
            existsSync(imageFiles[index]),
        ),
      ),
    )
    const hashes = imageFiles.map((imageFile) =>
      createHash('sha256').update(readFileSync(imageFile)).digest('hex'),
    )
    assert.equal(new Set(hashes).size, products.length)
  })

  it('filters every category without using a second product array', () => {
    for (const category of catalogCategories) {
      const result = filterProducts(products, '', {
        ...defaultFilters,
        categoryId: category.id,
      })

      assert.ok(result.length > 0)
      assert.ok(
        result.every((product) => product.categoryId === category.id),
      )
    }
  })
})
