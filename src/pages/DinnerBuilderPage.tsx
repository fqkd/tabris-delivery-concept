import { Check, MinusCircle, RotateCcw, ShoppingBag, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useShop } from '../context/ShopContext'
import { dinnerSets } from '../data/dinnerSets'
import { getProduct } from '../data/products'
import {
  calculateDinnerTotal,
  dinnerItemsToCartAdditions,
} from '../lib/dinner'
import { publicAssetUrl } from '../lib/deployment'
import { formatPrice, formatProductCount } from '../lib/format'

export function DinnerBuilderPage() {
  const navigate = useNavigate()
  const { addCartItems } = useShop()
  const [activeSetId, setActiveSetId] = useState(dinnerSets[0].id)
  const [excludedBySet, setExcludedBySet] = useState<Record<string, string[]>>(
    {},
  )
  const [addedMessage, setAddedMessage] = useState('')

  const activeSet =
    dinnerSets.find((dinnerSet) => dinnerSet.id === activeSetId) ?? dinnerSets[0]
  const excludedProductIds = excludedBySet[activeSet.id] ?? []
  const selectedItems = activeSet.items.filter(
    (item) => !excludedProductIds.includes(item.productId),
  )
  const total = calculateDinnerTotal(activeSet, excludedProductIds)

  const toggleProduct = (productId: string) => {
    setAddedMessage('')
    setExcludedBySet((current) => {
      const excluded = current[activeSet.id] ?? []
      const nextExcluded = excluded.includes(productId)
        ? excluded.filter((id) => id !== productId)
        : [...excluded, productId]

      return { ...current, [activeSet.id]: nextExcluded }
    })
  }

  const addSetToCart = () => {
    const additions = dinnerItemsToCartAdditions(activeSet, excludedProductIds)
    if (additions.length === 0) return

    addCartItems(additions)
    const count = additions.reduce((sum, item) => sum + item.quantity, 0)
    setAddedMessage(
      `${activeSet.name}: ${formatProductCount(count)} добавлено в корзину.`,
    )
  }

  return (
    <main className="screen screen--dinner has-bottom-nav">
      <PageHeader title="Собрать ужин" backTo="/" />

      <header className="dinner-intro">
        <span>Помощник для спокойного вечера</span>
        <h2>Ужин, о котором уже позаботились за вас</h2>
        <p>
          Выберите готовый набор и уберите то, что сегодня не нужно. Цена
          пересчитается автоматически.
        </p>
      </header>

      <section className="dinner-sets" aria-labelledby="dinner-sets-title">
        <h2 id="dinner-sets-title">Выберите вариант</h2>
        <div className="dinner-set-tabs" role="tablist" aria-label="Варианты ужина">
          {dinnerSets.map((dinnerSet) => {
            const firstProduct = getProduct(dinnerSet.items[0].productId)
            const active = dinnerSet.id === activeSet.id

            return (
              <button
                key={dinnerSet.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={active ? 'is-active' : undefined}
                onClick={() => {
                  setActiveSetId(dinnerSet.id)
                  setAddedMessage('')
                }}
              >
                {firstProduct && (
                  <img
                    src={publicAssetUrl(firstProduct.image)}
                    alt=""
                    width="88"
                    height="72"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span>
                  <strong>{dinnerSet.name}</strong>
                  <small>
                    {dinnerSet.people} персоны · {dinnerSet.servingTime}
                  </small>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="dinner-composition" aria-labelledby="dinner-composition-title">
        <div className="dinner-composition__heading">
          <div>
            <h2 id="dinner-composition-title">{activeSet.name}</h2>
            <p>{activeSet.description}</p>
          </div>
          <span>
            <UsersRound aria-hidden="true" />
            {activeSet.people}
          </span>
        </div>

        <ul className="dinner-items">
          {activeSet.items.map((item) => {
            const product = getProduct(item.productId)
            if (!product) return null
            const excluded = excludedProductIds.includes(item.productId)

            return (
              <li key={item.productId} className={excluded ? 'is-excluded' : undefined}>
                <Link
                  to={`/product/${product.id}`}
                  state={{ from: '/dinner' }}
                  className="dinner-item__image"
                  aria-label={`Открыть товар «${product.name}»`}
                >
                  <img
                    src={publicAssetUrl(product.image)}
                    alt=""
                    width="88"
                    height="88"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
                <div className="dinner-item__copy">
                  <span>{item.role}</span>
                  <Link to={`/product/${product.id}`} state={{ from: '/dinner' }}>
                    {product.name}
                  </Link>
                  <small>
                    {item.quantity} × {formatPrice(product.price)} ₽
                  </small>
                </div>
                <button
                  type="button"
                  className="dinner-item__toggle"
                  aria-pressed={excluded}
                  aria-label={
                    excluded
                      ? `Вернуть «${product.name}» в набор`
                      : `Исключить «${product.name}» из набора`
                  }
                  onClick={() => toggleProduct(product.id)}
                >
                  {excluded ? (
                    <>
                      <RotateCcw aria-hidden="true" />
                      <span>Вернуть</span>
                    </>
                  ) : (
                    <>
                      <MinusCircle aria-hidden="true" />
                      <span>Убрать</span>
                    </>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="dinner-total" aria-label="Итог набора">
        <div>
          <span>Выбрано позиций</span>
          <strong>{selectedItems.length} из {activeSet.items.length}</strong>
        </div>
        <div>
          <span>Стоимость</span>
          <strong>{formatPrice(total)} ₽</strong>
        </div>
        <p>Стоимость равна сумме выбранных товаров, без дополнительной скидки.</p>
        <button
          type="button"
          className="primary-button primary-button--wide dinner-add-button"
          disabled={selectedItems.length === 0}
          onClick={addSetToCart}
        >
          {selectedItems.length > 0 ? (
            <>
              <ShoppingBag aria-hidden="true" />
              Добавить набор · {formatPrice(total)} ₽
            </>
          ) : (
            'Выберите хотя бы один товар'
          )}
        </button>

        <div className="dinner-added" aria-live="polite">
          {addedMessage && (
            <>
              <span>
                <Check aria-hidden="true" />
                {addedMessage}
              </span>
              <button type="button" onClick={() => navigate('/cart')}>
                Перейти в корзину
              </button>
            </>
          )}
        </div>
      </section>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
