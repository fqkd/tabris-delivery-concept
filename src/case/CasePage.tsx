import {
  ArrowDown,
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  Gift,
  Heart,
  Leaf,
  MapPin,
  PackageCheck,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'

const screenshots = '/images/case/screens'
const products = '/images/products'
const demoTrackingPath =
  '/orders/%D0%94%D0%95%D0%9C%D0%9E-230930/tracking'
const searchFrames = ['empty', 's', 'st', 'ste', 'stei', 'steik'] as const

type DeviceProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
  children?: ReactNode
}

function Device({
  src,
  alt,
  className = '',
  priority = false,
  children,
}: DeviceProps) {
  return (
    <figure className={`case-device ${className}`.trim()}>
      <div className="case-device__speaker" aria-hidden="true" />
      <div className="case-device__screen">
        <img
          src={src}
          alt={alt}
          width="390"
          height="844"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
        />
        {children}
      </div>
    </figure>
  )
}

type PrototypeLinkProps = {
  href?: string
  className?: string
  children: ReactNode
}

function PrototypeLink({
  href = '/?source=case',
  className = '',
  children,
}: PrototypeLinkProps) {
  const openPrototype = (event: MouseEvent<HTMLAnchorElement>) => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    if (isMobile) return
    event.preventDefault()
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <a className={className} href={href} onClick={openPrototype}>
      {children}
    </a>
  )
}

const SearchSequence = ({
  active,
  reducedMotion,
}: {
  active: boolean
  reducedMotion: boolean
}) => {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setFrame(searchFrames.length - 1)
      return
    }
    if (!active || frame > 0) return
    let current = 0
    const timer = window.setInterval(() => {
      current += 1
      setFrame(Math.min(current, searchFrames.length - 1))
      if (current >= searchFrames.length - 1) window.clearInterval(timer)
    }, 260)
    return () => window.clearInterval(timer)
  }, [active, frame, reducedMotion])

  return (
    <div className="search-sequence" aria-label="Поиск по запросу «стейк»">
      <img
        src={`${screenshots}/search-${searchFrames[frame]}.webp`}
        alt=""
        width="358"
        height="50"
      />
      <span>Запрос «стейк» и результаты каталога</span>
    </div>
  )
}

export function CasePage() {
  const [scrolled, setScrolled] = useState(false)
  const [catalogActive, setCatalogActive] = useState(false)
  const [checkoutActive, setCheckoutActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const catalogRef = useRef<HTMLElement>(null)
  const checkoutRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => setReducedMotion(motionQuery.matches)
    onMotionChange()
    motionQuery.addEventListener('change', onMotionChange)

    const onScroll = () => setScrolled(window.scrollY > 360)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.14 },
    )
    document
      .querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach((element) => revealObserver.observe(element))

    const featureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === catalogRef.current && entry.isIntersecting) {
            setCatalogActive(true)
          }
          if (entry.target === checkoutRef.current && entry.isIntersecting) {
            setCheckoutActive(true)
          }
        })
      },
      { threshold: 0.38 },
    )
    if (catalogRef.current) featureObserver.observe(catalogRef.current)
    if (checkoutRef.current) featureObserver.observe(checkoutRef.current)

    return () => {
      window.removeEventListener('scroll', onScroll)
      motionQuery.removeEventListener('change', onMotionChange)
      revealObserver.disconnect()
      featureObserver.disconnect()
    }
  }, [])

  return (
    <div className="case-page">
      <header className={`case-nav${scrolled ? ' is-scrolled' : ''}`}>
        <a className="case-nav__brand" href="#top" aria-label="К началу кейса">
          <img
            src="/images/brand/tabris-app-mark.webp"
            alt=""
            width="42"
            height="42"
          />
          <span>Табрис Доставка</span>
        </a>
        <span className="case-nav__note">Неофициальный прототип</span>
        <PrototypeLink className="case-nav__prototype">
          Прототип
          <ExternalLink aria-hidden="true" />
        </PrototypeLink>
      </header>

      <main>
        <section className="case-hero" id="top">
          <div className="case-hero__glow" aria-hidden="true" />
          <div className="case-container case-hero__layout">
            <div className="case-hero__copy" data-reveal>
              <span className="case-eyebrow">
                Неофициальная инициативная концепция
              </span>
              <h1>Концепция мобильной доставки</h1>
              <p>
                Интерактивный прототип: от готового ужина и каталога до
                оформления, статуса и истории заказа.
              </p>
              <div className="case-actions">
                <a className="case-button case-button--primary" href="#idea">
                  Смотреть кейс
                  <ArrowDown aria-hidden="true" />
                </a>
                <PrototypeLink className="case-button case-button--secondary">
                  Открыть прототип
                  <ExternalLink aria-hidden="true" />
                </PrototypeLink>
              </div>
              <dl className="case-hero__facts">
                <div>
                  <dt>Ужин</dt>
                  <dd>готовые наборы и блюда</dd>
                </div>
                <div>
                  <dt>Каталог</dt>
                  <dd>поиск, категории, карточки</dd>
                </div>
                <div>
                  <dt>Заказ</dt>
                  <dd>оформление, статус, история</dd>
                </div>
              </dl>
            </div>

            <div className="case-hero__visual" data-reveal>
              <div className="food-object food-object--salad">
                <img
                  src={`${products}/salad-roast-beef.webp`}
                  alt="Салат с ростбифом"
                  width="600"
                  height="600"
                  fetchPriority="high"
                />
              </div>
              <div className="food-object food-object--pasta">
                <img
                  src={`${products}/chicken-mushroom-pasta.webp`}
                  alt="Паста с курицей и грибами"
                  width="600"
                  height="600"
                  fetchPriority="high"
                />
              </div>
              <span className="hero-herb hero-herb--one" aria-hidden="true">
                <Leaf />
              </span>
              <span className="hero-herb hero-herb--two" aria-hidden="true">
                <Leaf />
              </span>
              <Device
                className="case-hero__device case-hero__device--home"
                src={`${screenshots}/home.webp`}
                alt="Главная страница приложения доставки «Табрис»"
                priority
              />
              <Device
                className="case-hero__device case-hero__device--product"
                src={`${screenshots}/product-salad.webp`}
                alt="Карточка салата с ростбифом"
                priority
              />
            </div>
          </div>
          <a className="case-hero__scroll" href="#idea" aria-label="Далее">
            <span>Листайте</span>
            <ArrowDown aria-hidden="true" />
          </a>
        </section>

        <section className="case-section case-idea" id="idea">
          <div className="case-container case-idea__layout">
            <div className="case-idea__statement" data-reveal>
              <span className="case-section-number">01 · Главная</span>
              <h2>Сначала — адрес и ближайшая доставка</h2>
              <p>
                До выбора товара уже видны адрес, ближайшее время и бонусный
                баланс. Ниже начинаются категории, набор на ужин и витрина
                собственного производства.
              </p>
              <div className="case-idea__line" aria-hidden="true">
                <span />
              </div>
            </div>
            <div className="case-idea__visual" data-reveal>
              <Device
                src={`${screenshots}/home.webp`}
                alt="Главная страница с идеями для ужина"
              />
              <div className="case-idea__dish">
                <img
                  src={`${products}/syrniki.webp`}
                  alt="Домашние сырники"
                  width="600"
                  height="600"
                  loading="lazy"
                />
                <span>Главная перед началом заказа</span>
              </div>
            </div>
          </div>
        </section>

        <section className="case-section case-principles">
          <div className="case-container">
            <div className="case-heading" data-reveal>
              <span className="case-section-number">
                02 · Что можно сделать
              </span>
              <h2>Собрать, найти, проверить</h2>
            </div>
            <div className="principle-list">
              <article className="principle principle--inspire" data-reveal>
                <div className="principle__copy">
                  <div className="principle__lead">
                    <span className="principle__index">01</span>
                    <Sparkles aria-hidden="true" />
                  </div>
                  <h3>Собрать ужин</h3>
                  <p>
                    Выбрать готовый набор, убрать лишнее и добавить оставшиеся
                    товары в корзину.
                  </p>
                </div>
                <div className="principle__screen">
                  <img
                    src={`${screenshots}/dinner.webp`}
                    alt="Экран выбора ужина"
                    width="390"
                    height="844"
                    loading="lazy"
                  />
                </div>
              </article>
              <article className="principle principle--simplify" data-reveal>
                <div className="principle__index">02</div>
                <div className="principle__copy">
                  <Search aria-hidden="true" />
                  <h3>Найти товар</h3>
                  <p>
                    Ввести запрос, открыть категорию или включить нужные
                    фильтры.
                  </p>
                </div>
                <div className="principle__screen">
                  <img
                    src={`${screenshots}/catalog-search.webp`}
                    alt="Результаты поиска в каталоге"
                    width="390"
                    height="844"
                    loading="lazy"
                  />
                </div>
              </article>
              <article className="principle principle--reassure" data-reveal>
                <div className="principle__index">03</div>
                <div className="principle__copy">
                  <Truck aria-hidden="true" />
                  <h3>Проверить доставку</h3>
                  <p>
                    В заказе в пути видны текущий этап, карта и ожидаемое время.
                  </p>
                </div>
                <div className="principle__screen">
                  <img
                    src={`${screenshots}/tracking-top.webp`}
                    alt="Этапы заказа в пути"
                    width="390"
                    height="844"
                    loading="lazy"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="case-section case-dinner">
          <div className="case-container">
            <div className="case-heading case-heading--center" data-reveal>
              <span className="case-section-number">
                03 · Готовый набор
              </span>
              <h2>Ужин можно подстроить</h2>
              <p>
                В наборе видны блюда, количество и общая сумма. Любую позицию
                можно убрать — цена пересчитается, а оставшееся добавится в
                корзину одним нажатием.
              </p>
            </div>
            <div className="case-dinner__table" data-reveal>
              <div className="case-dinner__plate">
                <img
                  src={`${products}/chicken-mushroom-pasta.webp`}
                  alt="Паста с курицей и лесными грибами"
                  width="600"
                  height="600"
                  loading="lazy"
                />
              </div>
              <Device
                className="case-dinner__home"
                src={`${screenshots}/home.webp`}
                alt="Главная страница"
              />
              <Device
                className="case-dinner__builder"
                src={`${screenshots}/dinner.webp`}
                alt="Конструктор ужина"
              />
              <div className="case-dinner__notes">
                <span>2 персоны</span>
                <span>12 минут</span>
                <span>Лишнее можно убрать</span>
              </div>
              <div className="case-dinner__ingredient case-dinner__ingredient--one">
                <img
                  src={`${products}/pear-sage-lemonade.webp`}
                  alt="Лимонад с грушей и шалфеем"
                  width="600"
                  height="600"
                  loading="lazy"
                />
              </div>
              <div className="case-dinner__ingredient case-dinner__ingredient--two">
                <img
                  src={`${products}/salad-roast-beef.webp`}
                  alt="Салат с ростбифом"
                  width="600"
                  height="600"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="case-section case-kitchen">
          <div className="case-container case-kitchen__layout">
            <div className="case-kitchen__copy" data-reveal>
              <span className="case-section-number">
                04 · Готовые блюда
              </span>
              <h2>Отдельно — блюда собственного производства</h2>
              <p>
                Если набор не нужен целиком, можно открыть отдельную витрину.
                Салаты, сырники, роллы и горячие блюда показаны там отдельно,
                с фильтрами по типу.
              </p>
              <div className="case-kitchen__product-grid">
                {[
                  ['syrniki.webp', 'Сырники'],
                  ['korean-beef-rice.webp', 'Рис с говядиной'],
                  ['salmon-roll.webp', 'Ролл с лососем'],
                ].map(([src, label]) => (
                  <figure key={src}>
                    <img
                      src={`${products}/${src}`}
                      alt={label}
                      width="600"
                      height="600"
                      loading="lazy"
                    />
                    <figcaption>{label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <Device
              className="case-kitchen__device"
              src={`${screenshots}/own-production.webp`}
              alt="Раздел собственного производства"
            />
          </div>
        </section>

        <section
          className="case-section case-catalog"
          ref={catalogRef}
        >
          <div className="case-container">
            <div className="case-heading case-heading--center" data-reveal>
              <span className="case-section-number">05 · Поиск и товар</span>
              <h2>Найти товар и проверить детали</h2>
              <p>
                Можно открыть полный список категорий или ввести запрос. В
                карточке салата указаны вес, состав, цена со скидкой, срок
                годности и сумма будущего начисления.
              </p>
            </div>
            <div className="case-catalog__stage" data-reveal>
              <Device
                className="case-catalog__categories"
                src={`${screenshots}/categories.webp`}
                alt="Полный список категорий"
              />
              <Device
                className="case-catalog__product"
                src={`${screenshots}/product-salad.webp`}
                alt="Карточка салата с ростбифом"
              />
              <Device
                className="case-catalog__results"
                src={`${screenshots}/catalog-search.webp`}
                alt="Поиск и результаты"
              />
              <SearchSequence
                active={catalogActive}
                reducedMotion={reducedMotion}
              />
              <div className="case-catalog__facts">
                <span>
                  <Leaf aria-hidden="true" />
                  Наше производство
                </span>
                <span>220 г</span>
                <span>359 ₽</span>
                <span>−14%</span>
                <span>Состав и срок годности</span>
              </div>
            </div>
          </div>
        </section>

        <section className="case-section case-journey">
          <div className="case-container">
            <div className="case-heading" data-reveal>
              <span className="case-section-number">
                06 · От корзины до доставки
              </span>
              <h2>Выбор превращается в заказ</h2>
              <p>
                Для примера собран заказ на 1 335 ₽ в Краснодаре: четыре товара
                и доставка завтра, 10:00–12:00. После оформления адрес, интервал
                и сумма остаются в подтверждении и отслеживании.
              </p>
            </div>
            <ol className="journey-path" data-reveal>
              {[
                [MapPin, 'Адрес', 'Краснодар'],
                [Search, 'Поиск', 'Товары найдены'],
                [Leaf, 'Товар', 'Состав и цена'],
                [ShoppingBag, 'Корзина', '4 товара'],
                [Clock3, 'Интервал', 'Завтра, 10–12'],
                [PackageCheck, 'Заказ', 'Принят'],
                [Truck, 'Доставка', 'Курьер в пути'],
              ].map(([Icon, title, detail], index) => {
                const StepIcon = Icon as typeof MapPin
                return (
                  <li key={title as string}>
                    <span className="journey-path__index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <StepIcon aria-hidden="true" />
                    <strong>{title as string}</strong>
                    <small>{detail as string}</small>
                  </li>
                )
              })}
            </ol>
            <div className="journey-screens" data-reveal>
              <img
                src={`${screenshots}/address.webp`}
                alt="Выбор города и адреса"
                width="390"
                height="844"
                loading="lazy"
              />
              <img
                src={`${screenshots}/product-salad.webp`}
                alt="Выбор товара"
                width="390"
                height="844"
                loading="lazy"
              />
              <img
                src={`${screenshots}/checkout-selected.webp`}
                alt="Выбор доставки"
                width="390"
                height="844"
                loading="lazy"
              />
              <img
                src={`${screenshots}/tracking-map.webp`}
                alt="Отслеживание заказа"
                width="390"
                height="844"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section
          className="case-section case-checkout"
          ref={checkoutRef}
        >
          <div className="case-container case-checkout__layout">
            <div className="case-checkout__copy" data-reveal>
              <span className="case-section-number">
                07 · Оформление
              </span>
              <h2>Проверить всё перед заказом</h2>
              <p>
                Здесь можно проверить адрес и получателя, выбрать интервал,
                правило замены, оплату и списание бонусов. Сумма и кнопка
                оформления остаются внизу.
              </p>
              <ul>
                <li>
                  <Check aria-hidden="true" />
                  Адрес и получатель
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Завтра, 10:00–12:00
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Замена после согласования
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Оплата и бонусы
                </li>
              </ul>
            </div>
            <div className="case-checkout__stage" data-reveal>
              <Device
                className="case-checkout__cart"
                src={`${screenshots}/cart.webp`}
                alt="Корзина с выбранными товарами"
              />
              <figure className="case-device case-checkout__main">
                <div className="case-device__speaker" aria-hidden="true" />
                <div className="case-device__screen checkout-sequence">
                  <img
                    className="checkout-sequence__before"
                    src={`${screenshots}/checkout-top.webp`}
                    alt="Начальное состояние оформления"
                    width="390"
                    height="844"
                    loading="lazy"
                  />
                  <img
                    className={checkoutActive ? 'is-selected' : ''}
                    src={`${screenshots}/checkout-selected.webp`}
                    alt="Оформление с выбранной доставкой на завтра"
                    width="390"
                    height="844"
                    loading="lazy"
                  />
                </div>
              </figure>
              <div className="case-checkout__interval">
                <span>Завтра · 10:00–12:00</span>
                <img
                  src={`${screenshots}/checkout-interval.webp`}
                  alt="Выбранный интервал доставки на завтра"
                  width="358"
                  height="256"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="case-section case-honest">
          <div className="case-container">
            <div className="case-heading case-heading--center" data-reveal>
              <span className="case-section-number">
                08 · Сразу после оформления
              </span>
              <h2>Заказ принят, карты пока нет</h2>
              <p>
                Новый заказ сохраняется со статусом «Заказ оформлен». На этом
                экране нет маршрута и времени прибытия; ниже показан отдельный
                демо-заказ, который уже передали курьеру.
              </p>
            </div>
            <div className="case-honest__stage" data-reveal>
              <Device
                className="case-honest__success"
                src={`${screenshots}/success.webp`}
                alt="Экран успешного оформления заказа"
              />
              <div className="case-honest__event">
                <span className="case-honest__event-icon">
                  <Check aria-hidden="true" />
                </span>
                <span>
                  <small>17:30</small>
                  <strong>Заказ оформлен</strong>
                  <p>Карта и время прибытия не показываются</p>
                </span>
              </div>
              <Device
                className="case-honest__tracking"
                src={`${screenshots}/new-order.webp`}
                alt="Новый заказ без карты и ETA"
              />
            </div>
          </div>
        </section>

        <section className="case-section case-tracking" id="tracking">
          <svg
            className="case-tracking__route"
            viewBox="0 0 1440 920"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M-80 770 C 160 560, 310 840, 510 600 S 840 160, 1010 400 S 1220 780, 1510 480"
            />
          </svg>
          <div className="case-container">
            <div className="case-heading case-heading--light" data-reveal>
              <span className="case-section-number">
                09 · Заказ в пути
              </span>
              <h2>Что видно, когда курьер выехал</h2>
              <p>
                В демо-заказе в пути есть время завершённых этапов, текущий
                статус, карта и ожидаемое время. Будущий этап доставки остаётся
                без времени.
              </p>
            </div>
            <div className="case-tracking__stage" data-reveal>
              <Device
                className="case-tracking__top"
                src={`${screenshots}/tracking-top.webp`}
                alt="Статус демонстрационного заказа"
              />
              <Device
                className="case-tracking__map"
                src={`${screenshots}/tracking-map.webp`}
                alt="Карта и ETA демонстрационного заказа в пути"
              />
              <aside className="tracking-facts">
                <div>
                  <Clock3 aria-hidden="true" />
                  <span>
                    <small>Прибытие</small>
                    <strong>12–18 минут</strong>
                  </span>
                </div>
                <div>
                  <Check aria-hidden="true" />
                  <span>
                    <small>Этапы</small>
                    <strong>Время только у наступивших</strong>
                  </span>
                </div>
                <div>
                  <MapPin aria-hidden="true" />
                  <span>
                    <small>Карта</small>
                    <strong>Обновлена 2 минуты назад</strong>
                  </span>
                </div>
                <PrototypeLink
                  href={demoTrackingPath}
                  className="case-button case-button--light"
                >
                  Открыть демо-заказ в пути
                  <ExternalLink aria-hidden="true" />
                </PrototypeLink>
              </aside>
            </div>
          </div>
        </section>

        <section className="case-section case-relationship">
          <div className="case-container">
            <div className="case-heading case-heading--center" data-reveal>
              <span className="case-section-number">
                10 · Профиль
              </span>
              <h2>Заказ сохраняется в истории</h2>
              <p>
                После оформления заказ появляется в профиле и открывается снова
                по нажатию. Там же остаются выбранный адрес и избранное, оттуда
                же можно открыть бонусный баланс.
              </p>
            </div>
            <div className="case-relationship__fan" data-reveal>
              <Device
                className="case-relationship__history"
                src={`${screenshots}/profile-history.webp`}
                alt="История с оформленным заказом"
              />
              <Device
                className="case-relationship__profile"
                src={`${screenshots}/profile.webp`}
                alt="Профиль покупателя"
              />
              <Device
                className="case-relationship__favorites"
                src={`${screenshots}/favorites.webp`}
                alt="Избранные товары"
              />
              <Device
                className="case-relationship__bonus"
                src={`${screenshots}/bonus.webp`}
                alt="Раздел «Табрис Бонус»"
              />
            </div>
            <div className="relationship-tags" data-reveal>
              <span>
                <PackageCheck aria-hidden="true" />
                История заказов
              </span>
              <span>
                <Heart aria-hidden="true" />
                Избранное
              </span>
              <span>
                <Gift aria-hidden="true" />
                Лояльность
              </span>
            </div>
          </div>
        </section>

        <section className="case-section case-system">
          <div className="case-container">
            <div className="case-system__language" data-reveal>
              <span className="case-section-number">
                11 · Визуальный язык
              </span>
              <h2>Цвета и типографика</h2>
              <div className="palette">
                <span style={{ '--swatch': '#1d3600' } as CSSProperties}>
                  Глубокий зелёный
                  <small>#1D3600</small>
                </span>
                <span style={{ '--swatch': '#f7f4ed' } as CSSProperties}>
                  Молочный
                  <small>#F7F4ED</small>
                </span>
                <span style={{ '--swatch': '#e9f3dc' } as CSSProperties}>
                  Светлый шалфей
                  <small>#E9F3DC</small>
                </span>
                <span style={{ '--swatch': '#ffffff' } as CSSProperties}>
                  Белые поверхности
                  <small>#FFFFFF</small>
                </span>
              </div>
              <div className="type-specimen">
                <span>Manrope</span>
                <strong>Паста с курицей и грибами</strong>
                <p>
                  Manrope 400–800: текст, подписи, заголовки и цены.
                </p>
              </div>
              <div className="component-strip" aria-label="Фрагмент дизайн-системы">
                <span className="component-strip__button">
                  Оформить заказ
                </span>
                <span>
                  <Leaf aria-hidden="true" />
                  Наше производство
                </span>
                <span>−14%</span>
              </div>
            </div>

            <div className="case-system__depth" data-reveal>
              <span className="case-section-number">
                12 · Что есть в демо
              </span>
              <h2>Что работает — и чего пока нет</h2>
              <div className="depth-metrics">
                <div>
                  <strong>43</strong>
                  <span>товара с отдельными фотографиями</span>
                </div>
                <div>
                  <strong>21</strong>
                  <span>категория</span>
                </div>
                <div>
                  <strong>5</strong>
                  <span>городов доставки</span>
                </div>
                <div>
                  <strong>360–430</strong>
                  <span>px · мобильные размеры</span>
                </div>
              </div>
              <div className="case-system__columns">
                <div>
                  <h3>В прототипе</h3>
                  <ul>
                    <li>Поиск, фильтры и карточки товаров</li>
                    <li>Наборы на ужин, избранное и корзина</li>
                    <li>Оформление с проверкой обязательных полей</li>
                    <li>Статус и история заказа в браузере</li>
                  </ul>
                </div>
                <div>
                  <h3>За рамками прототипа</h3>
                  <ul>
                    <li>Актуальные остатки и цены</li>
                    <li>Серверная часть, авторизация и оплата</li>
                    <li>Интеграция с лояльностью, OMS и курьерами</li>
                    <li>Реальные правила доставки и замен</li>
                  </ul>
                </div>
              </div>
              <p className="case-system__disclaimer">
                Это не действующий сервис «Табриса»: прототип не подключён к
                его системам.
              </p>
            </div>
          </div>
        </section>

        <section className="case-final">
          <div className="case-container case-final__layout">
            <div className="case-final__copy" data-reveal>
              <span className="case-eyebrow">
                От выбора до истории заказа
              </span>
              <h2>Пройдите весь путь</h2>
              <p>
                Выберите набор или отдельные товары, назначьте время доставки,
                оформите демо-заказ и откройте его из истории в профиле.
              </p>
              <div className="case-actions">
                <PrototypeLink className="case-button case-button--light">
                  Открыть прототип
                  <ExternalLink aria-hidden="true" />
                </PrototypeLink>
                <a
                  className="case-button case-button--ghost"
                  href="mailto:?subject=%D0%A2%D0%B0%D0%B1%D1%80%D0%B8%D1%81%20%D0%94%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0%20%E2%80%94%20%D0%BE%D0%B1%D1%81%D1%83%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BE%D0%BD%D1%86%D0%B5%D0%BF%D1%86%D0%B8%D0%B8"
                >
                  Обсудить концепцию
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
              <small>
                Все данные остаются в браузере. Реальные заказы и платежи не
                отправляются.
              </small>
            </div>
            <div className="case-final__visual" data-reveal>
              <div className="case-final__dish">
                <img
                  src={`${products}/salad-roast-beef.webp`}
                  alt="Салат с ростбифом"
                  width="600"
                  height="600"
                  loading="lazy"
                />
              </div>
              <Device
                className="case-final__home"
                src={`${screenshots}/home.webp`}
                alt="Главная страница прототипа"
              />
              <Device
                className="case-final__tracking"
                src={`${screenshots}/tracking-map.webp`}
                alt="Отслеживание заказа"
              />
            </div>
          </div>
          <footer className="case-footer">
            <span>Табрис Доставка · интерактивная концепция</span>
            <span>Не является официальным продуктом «Табриса»</span>
            <a href="#top">Наверх ↑</a>
          </footer>
        </section>
      </main>
    </div>
  )
}
