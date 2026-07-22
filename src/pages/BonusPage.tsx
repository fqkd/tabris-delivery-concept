import {
  Check,
  ChevronRight,
  Gift,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
} from 'lucide-react'
import { DemoReceiptToggle } from '../components/DemoReceiptToggle'
import { PageHeader } from '../components/PageHeader'
import { favoriteCategoryIds } from '../config/demoRules'
import { useShop } from '../context/ShopContext'
import { getCategoryLabel } from '../data/catalogCategories'
import { formatPrice } from '../lib/format'

const decorativeBars = [
  2, 5, 1, 3, 6, 2, 4, 1, 5, 3, 2, 6, 1, 4, 2, 5, 1, 3, 6, 2, 4, 1,
]

export function BonusPage() {
  const { bonusBalance, lastOrder } = useShop()

  return (
    <main className="screen screen--tabris-bonus has-bottom-nav">
      <PageHeader title="Табрис Бонус" backTo="/profile" />

      <section
        className="tabris-bonus-card"
        aria-labelledby="tabris-bonus-card-title"
      >
        <div className="tabris-bonus-card__topline">
          <span>
            <WalletCards aria-hidden="true" />
            <strong id="tabris-bonus-card-title">Табрис Бонус</strong>
          </span>
          <span className="tabris-bonus-card__demo-label">Демо-карта</span>
        </div>

        <div className="tabris-bonus-card__balance">
          <small>Демонстрационный баланс</small>
          <strong>{formatPrice(bonusBalance)} бонусов</strong>
          <span>1 бонус = 1 ₽</span>
        </div>

        <div
          className="tabris-bonus-card__barcode"
          aria-label="Декоративный код, не предназначен для сканирования"
        >
          <span className="tabris-bonus-card__bars" aria-hidden="true">
            {decorativeBars.map((width, index) => (
              <i
                key={`${width}-${index}`}
                style={{
                  width: `${width}px`,
                  height: `${index % 4 === 0 ? 26 : index % 3 === 0 ? 20 : 23}px`,
                }}
              />
            ))}
          </span>
          <strong>НЕ ДЛЯ СКАНИРОВАНИЯ</strong>
        </div>
      </section>

      <p className="tabris-bonus-demo-note">
        Баланс, изображение карты и код — безопасные демонстрационные данные,
        не связанные с участником программы.
      </p>

      <section className="tabris-bonus-section" aria-labelledby="bonus-earned-title">
        <div className="tabris-bonus-section__heading">
          <span className="tabris-bonus-section__icon" aria-hidden="true">
            <Gift />
          </span>
          <div>
            <small>Начисления</small>
            <h2 id="bonus-earned-title">Последний заказ</h2>
          </div>
        </div>
        {lastOrder ? (
          <div className="tabris-bonus-earned">
            <span>
              <strong>+{formatPrice(lastOrder.totals.bonusEarned)}</strong>
              <small>после выполнения</small>
            </span>
            <span>
              <small>Демонстрационный заказ</small>
              <strong>{lastOrder.id}</strong>
            </span>
          </div>
        ) : (
          <p className="tabris-bonus-section__empty">
            После демонстрационного заказа здесь появится расчёт начисления.
          </p>
        )}
      </section>

      <section
        className="tabris-bonus-section"
        aria-labelledby="favorite-categories-title"
      >
        <div className="tabris-bonus-section__heading">
          <span className="tabris-bonus-section__icon" aria-hidden="true">
            <Star />
          </span>
          <div>
            <small>10% бонусами</small>
            <h2 id="favorite-categories-title">Любимые категории</h2>
          </div>
        </div>
        <ul className="tabris-bonus-categories">
          {favoriteCategoryIds.map((categoryId) => (
            <li key={categoryId}>
              <Check aria-hidden="true" />
              <span>{getCategoryLabel(categoryId)}</span>
            </li>
          ))}
        </ul>
        <p className="tabris-bonus-section__hint">
          Выбор категорий на этом экране — демонстрационное наполнение. По
          опубликованным правилам участник может выбрать три любимые категории
          и менять их один раз в календарный месяц.
        </p>
      </section>

      <section className="tabris-bonus-section" aria-labelledby="bonus-receipts-title">
        <div className="tabris-bonus-section__heading">
          <span className="tabris-bonus-section__icon" aria-hidden="true">
            <ReceiptText />
          </span>
          <div>
            <small>Настройка профиля</small>
            <h2 id="bonus-receipts-title">Чеки в приложении</h2>
          </div>
        </div>
        <DemoReceiptToggle description="Сохранять демонстрационные чеки в профиле" />
        <p className="tabris-bonus-section__hint">
          Электронные чеки предусмотрены программой. Сам переключатель в этом
          концепте работает только локально.
        </p>
      </section>

      <section className="tabris-bonus-section" aria-labelledby="bonus-rules-title">
        <div className="tabris-bonus-section__heading">
          <span className="tabris-bonus-section__icon" aria-hidden="true">
            <ShieldCheck />
          </span>
          <div>
            <small>Официальная механика</small>
            <h2 id="bonus-rules-title">Главное о программе</h2>
          </div>
        </div>
        <ul className="tabris-bonus-rules">
          <li>
            <Sparkles aria-hidden="true" />
            <span>
              <strong>5% от покупки</strong>
              <small>Базовое начисление бонусов</small>
            </span>
          </li>
          <li>
            <Star aria-hidden="true" />
            <span>
              <strong>10% в любимых категориях</strong>
              <small>Для трёх выбранных категорий участника</small>
            </span>
          </li>
          <li>
            <WalletCards aria-hidden="true" />
            <span>
              <strong>1 бонус равен 1 рублю</strong>
              <small>При использовании бонусов для оплаты</small>
            </span>
          </li>
        </ul>
        <p className="tabris-bonus-rules__exclusions">
          Бонусы не начисляются на товары по акции, подарочные сертификаты и
          табачную продукцию. Для списания и отдельных категорий действуют
          ограничения опубликованных правил программы.
        </p>

        <details className="tabris-bonus-plus">
          <summary>
            <span>
              <strong>Табрис Плюс</strong>
              <small>Подтверждённый статус программы</small>
            </span>
            <ChevronRight aria-hidden="true" />
          </summary>
          <p>
            Статус можно получить после покупок от 60 000 ₽ за период до 90
            дней. Он действует 90 дней и добавляет ещё две любимые категории —
            всего их становится пять.
          </p>
        </details>
      </section>

      <p className="concept-note">
        Неофициальный концепт мобильного приложения “Табрис”. Создан для
        демонстрации.
      </p>
    </main>
  )
}
