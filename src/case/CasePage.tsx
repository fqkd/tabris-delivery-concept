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
      <span>Реальный поиск по каталогу</span>
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
        <span className="case-nav__note">Неофициальная концепция</span>
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
                Инициативная неофициальная концепция
              </span>
              <h1>
                Табрис Доставка —
                <span>
                  {' '}
                  цифровое продолжение гастрономи&shy;ческого опыта
                </span>
              </h1>
              <p>
                Инициативная интерактивная концепция мобильного сервиса: от
                вдохновения и выбора еды до понятной доставки домой.
              </p>
              <div className="case-actions">
                <a className="case-button case-button--primary" href="#idea">
                  Смотреть концепцию
                  <ArrowDown aria-hidden="true" />
                </a>
                <PrototypeLink className="case-button case-button--secondary">
                  Открыть прототип
                  <ExternalLink aria-hidden="true" />
                </PrototypeLink>
              </div>
              <dl className="case-hero__facts">
                <div>
                  <dt>43</dt>
                  <dd>уникальных товара</dd>
                </div>
                <div>
                  <dt>21</dt>
                  <dd>категория</dd>
                </div>
                <div>
                  <dt>5</dt>
                  <dd>городов</dd>
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
              <span className="case-section-number">01 · Продуктовая идея</span>
              <h2>Не переносить супермаркет в смартфон</h2>
              <p>
                Концепция переносит в цифровую среду главное качество
                «Табриса» — способность помочь выбрать вкусную еду и уверенно
                получить её дома.
              </p>
              <div className="case-idea__line" aria-hidden="true">
                <span />
              </div>
            </div>
            <div className="case-idea__visual" data-reveal>
              <Device
                src={`${screenshots}/home.webp`}
                alt="Главная страница с гастрономическими сценариями"
              />
              <div className="case-idea__dish">
                <img
                  src={`${products}/syrniki.webp`}
                  alt="Домашние сырники"
                  width="600"
                  height="600"
                  loading="lazy"
                />
                <span>Выбор начинается с аппетита, а не с фильтра</span>
              </div>
            </div>
          </div>
        </section>

        <section className="case-section case-principles">
          <div className="case-container">
            <div className="case-heading" data-reveal>
              <span className="case-section-number">02 · Три принципа</span>
              <h2>Вдохновить. Упростить. Успокоить.</h2>
            </div>
            <div className="principle-list">
              <article className="principle principle--inspire" data-reveal>
                <div className="principle__index">01</div>
                <div className="principle__copy">
                  <Sparkles aria-hidden="true" />
                  <h3>Вдохновить</h3>
                  <p>
                    Готовые блюда, собственное производство и сценарии выбора
                    помогают придумать ужин.
                  </p>
                </div>
                <div className="principle__screen">
                  <img
                    src={`${screenshots}/dinner.webp`}
                    alt="Сценарий «Собрать ужин»"
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
                  <h3>Упростить</h3>
                  <p>
                    Поиск, категории и понятная карточка сокращают путь до
                    уверенного выбора.
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
                  <h3>Успокоить</h3>
                  <p>
                    Интервалы, замены и честные статусы объясняют, что
                    происходит с заказом.
                  </p>
                </div>
                <div className="principle__screen">
                  <img
                    src={`${screenshots}/tracking-top.webp`}
                    alt="Статус заказа в пути"
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
                03 · Гастрономическое вдохновение
              </span>
              <h2>Сначала — идея для ужина. Потом — товары</h2>
              <p>
                Главный экран начинает разговор не с бесконечной сетки, а с
                готового сценария, который можно изменить под себя.
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
                <span>Состав можно изменить</span>
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
                04 · Собственное производство
              </span>
              <h2>Собственная кухня — в центре выбора</h2>
              <p>
                Готовые блюда и собственное производство получают
                самостоятельную роль, а не теряются среди общего каталога.
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
              <span className="case-section-number">05 · Каталог и товар</span>
              <h2>Всё необходимое, чтобы выбрать уверенно</h2>
              <p>
                Основное доказательство — сам интерфейс: фотография, состав,
                вес, цена, бонусы, наличие и происхождение товара.
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
                06 · Единый пользовательский путь
              </span>
              <h2>Один спокойный сценарий — от адреса до двери</h2>
              <p>
                Покупатель в Краснодаре планирует ужин на завтра, выбирает
                продукты и готовое блюдо, оформляет доставку и следит за
                заказом.
              </p>
            </div>
            <ol className="journey-path" data-reveal>
              {[
                [MapPin, 'Адрес', 'Краснодар'],
                [Sparkles, 'Выбор еды', 'Ужин на двоих'],
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
                07 · Оформление доставки
              </span>
              <h2>Доставка понятна до подтверждения заказа</h2>
              <p>
                Адрес, будущая дата, интервал, получатель, замены, оплата и
                бонусы собраны в одном последовательном оформлении.
              </p>
              <ul>
                <li>
                  <Check aria-hidden="true" />
                  Доставка на завтра
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Интервал 10:00–12:00
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Замена только после согласования
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Итог и бонусы до подтверждения
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
                <span>Будущая дата и интервал</span>
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
                08 · Честное начало заказа
              </span>
              <h2>Без ложного ожидания курьера</h2>
              <p>
                Сразу после оформления сервис показывает только подтверждённые
                этапы. Карта и время прибытия появляются, когда заказ
                действительно передан в доставку.
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
                  <p>Только фактически наступивший этап</p>
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
                09 · Отслеживание
              </span>
              <h2>Заказ движется — и это видно</h2>
              <p>
                Завершённые этапы имеют время, активный этап выделен, а
                будущий остаётся без выдуманного прогноза.
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
                    <small>Ожидаемое прибытие</small>
                    <strong>12–18 минут</strong>
                  </span>
                </div>
                <div>
                  <Check aria-hidden="true" />
                  <span>
                    <small>Хронология</small>
                    <strong>Только реальные события</strong>
                  </span>
                </div>
                <div>
                  <MapPin aria-hidden="true" />
                  <span>
                    <small>Маршрут</small>
                    <strong>Обновлён 2 минуты назад</strong>
                  </span>
                </div>
                <PrototypeLink
                  href={demoTrackingPath}
                  className="case-button case-button--light"
                >
                  Посмотреть заказ в прототипе
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
                10 · Отношения после покупки
              </span>
              <h2>Не только доставка, но и возвращение</h2>
              <p>
                История заказов, избранное и «Табрис Бонус» превращают
                разовую доставку в продолжение отношений с брендом.
              </p>
            </div>
            <div className="case-relationship__fan" data-reveal>
              <Device
                className="case-relationship__history"
                src={`${screenshots}/profile-history.webp`}
                alt="История нескольких заказов"
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
              <h2>Тёплый гастрономичный минимализм</h2>
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
                <strong>Еда, которую хочется выбрать</strong>
                <p>Спокойная иерархия, мягкие тени, много воздуха.</p>
              </div>
              <div className="component-strip" aria-label="Фрагмент дизайн-системы">
                <span className="component-strip__button">
                  Основное действие
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
                12 · Глубина и ограничения
              </span>
              <h2>Проработано глубоко — показано честно</h2>
              <div className="depth-metrics">
                <div>
                  <strong>43</strong>
                  <span>товара и уникальные фотографии</span>
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
                  <h3>Уже реализовано</h3>
                  <ul>
                    <li>Полный интерактивный путь</li>
                    <li>Корзина, избранное и несколько заказов</li>
                    <li>Будущая дата и честные статусы</li>
                    <li>Работа после обновления страницы</li>
                  </ul>
                </div>
                <div>
                  <h3>Пока остаётся гипотезой</h3>
                  <ul>
                    <li>Реальные остатки и цены</li>
                    <li>Backend, оплата и авторизация</li>
                    <li>Лояльность, OMS и курьерская система</li>
                    <li>Операционные правила доставки</li>
                  </ul>
                </div>
              </div>
              <p className="case-system__disclaimer">
                Концепция не выдаёт продуктовые гипотезы за существующие
                возможности «Табриса».
              </p>
            </div>
          </div>
        </section>

        <section className="case-final">
          <div className="case-container case-final__layout">
            <div className="case-final__copy" data-reveal>
              <span className="case-eyebrow">
                Инициативная неофициальная концепция
              </span>
              <h2>Попробуйте пройти путь покупателя</h2>
              <p>
                Выберите еду, оформите доставку на завтра и посмотрите, как
                сервис сопровождает заказ.
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
                Прототип работает локально в браузере и не отправляет заказы
                или платёжные данные.
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
