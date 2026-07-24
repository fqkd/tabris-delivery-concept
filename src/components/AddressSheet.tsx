import {
  Check,
  Clock3,
  MapPin,
  Navigation,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  deliveryCities,
  isDeliveryCity,
  type DeliveryCity,
} from '../config/demoRules'
import { useShop } from '../context/ShopContext'
import { getNearestDeliveryTimeLabel } from '../lib/deliveryDates'

const getInitialCity = (city: string | undefined): DeliveryCity =>
  isDeliveryCity(city) ? city : deliveryCities[0]

export function AddressSheet() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    address,
    isAddressOpen,
    closeAddress,
    confirmAddress,
  } = useShop()
  const [city, setCity] = useState<DeliveryCity>(() =>
    getInitialCity(address?.city),
  )
  const [street, setStreet] = useState(address?.street ?? '')
  const dialogRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const modalHistoryRef = useRef(false)
  const pendingModalHistoryRef = useRef(false)
  const nearestDeliveryTime = getNearestDeliveryTimeLabel()
  const locationState = useMemo(
    () =>
      typeof location.state === 'object' && location.state !== null
        ? (location.state as Record<string, unknown>)
        : {},
    [location.state],
  )
  const hasModalHistory = locationState.addressSheet === true
  const currentRoute = `${location.pathname}${location.search}${location.hash}`

  const closeSheet = useCallback(() => {
    closeAddress()
    if (hasModalHistory) navigate(-1)
  }, [closeAddress, hasModalHistory, navigate])

  const confirmSheetAddress = useCallback(
    (nextAddress: Parameters<typeof confirmAddress>[0]) => {
      confirmAddress(nextAddress)
      if (hasModalHistory) navigate(-1)
    },
    [confirmAddress, hasModalHistory, navigate],
  )

  useEffect(() => {
    if (!isAddressOpen) {
      modalHistoryRef.current = false
      pendingModalHistoryRef.current = false
      return
    }

    if (hasModalHistory) {
      pendingModalHistoryRef.current = false
      modalHistoryRef.current = true
      return
    }

    if (pendingModalHistoryRef.current) return

    if (!modalHistoryRef.current) {
      pendingModalHistoryRef.current = true
      navigate(currentRoute, {
        state: {
          ...locationState,
          addressSheet: true,
        },
      })
      return
    }

    if (modalHistoryRef.current && !hasModalHistory) {
      modalHistoryRef.current = false
      closeAddress()
    }
  }, [
    closeAddress,
    currentRoute,
    hasModalHistory,
    isAddressOpen,
    locationState,
    navigate,
  ])

  useEffect(() => {
    if (isAddressOpen) {
      setCity(getInitialCity(address?.city))
      setStreet(address?.street ?? '')
      previousFocusRef.current = document.activeElement as HTMLElement | null
      window.requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [address?.city, address?.street, isAddressOpen])

  useEffect(() => {
    if (!isAddressOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeSheet()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled)',
        ),
      )
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.requestAnimationFrame(() => previousFocusRef.current?.focus())
    }
  }, [closeSheet, isAddressOpen])

  if (!isAddressOpen) return null

  const chooseCity = (nextCity: DeliveryCity) => {
    setCity(nextCity)
    const confirmedStreet = street.trim()
    if (!confirmedStreet) return

    confirmSheetAddress({
      city: nextCity,
      street: confirmedStreet,
      deliveryTime: nearestDeliveryTime,
    })
  }

  return (
    <div className="sheet-overlay" role="presentation">
      <button
        type="button"
        className="sheet-overlay__backdrop"
        aria-label="Закрыть выбор адреса"
        onClick={closeSheet}
      />
      <section
        ref={dialogRef}
        className="address-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-title"
      >
        <div className="address-sheet__handle" aria-hidden="true" />
        <div className="address-sheet__heading">
          <div>
            <span className="address-sheet__eyebrow">Доставка продуктов</span>
            <h2 id="address-title">Куда доставить?</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Закрыть"
            onClick={closeSheet}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <fieldset className="city-picker">
          <legend className="field-label">Город</legend>
          <div className="city-picker__options">
            {deliveryCities.map((deliveryCity) => {
              const selected = city === deliveryCity
              return (
                <button
                  key={deliveryCity}
                  type="button"
                  className={selected ? 'is-selected' : undefined}
                  aria-pressed={selected}
                  onClick={() => chooseCity(deliveryCity)}
                >
                  <MapPin aria-hidden="true" />
                  <span>{deliveryCity}</span>
                  {selected && <Check aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="field-label" htmlFor="delivery-address">
          Адрес
        </label>
        <div className="text-field">
          <Navigation aria-hidden="true" />
          <input
            ref={inputRef}
            id="delivery-address"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            placeholder="Улица и дом"
          />
        </div>

        <button
          type="button"
          className="saved-address"
          onClick={() => setStreet('ул. Демонстрационная, 12')}
        >
          <span className="saved-address__icon">
            <Check aria-hidden="true" />
          </span>
          <span>
            <strong>ул. Демонстрационная, 12</strong>
            <small>Демонстрационный адрес</small>
          </span>
        </button>

        <div className="delivery-slot">
          <Clock3 aria-hidden="true" />
          <span>
            <small>Ближайшая доставка</small>
            <strong>{nearestDeliveryTime}</strong>
          </span>
        </div>

        <button
          type="button"
          className="primary-button primary-button--wide"
          disabled={!street.trim()}
          onClick={() =>
            confirmSheetAddress({
              city,
              street: street.trim(),
              deliveryTime: nearestDeliveryTime,
            })
          }
        >
          Доставить сюда
        </button>
      </section>
    </div>
  )
}
