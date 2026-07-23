import {
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Navigation,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useShop } from '../context/ShopContext'
import { getNearestDeliveryTimeLabel } from '../lib/deliveryDates'

export function AddressSheet() {
  const {
    address,
    isAddressOpen,
    closeAddress,
    confirmAddress,
  } = useShop()
  const [city, setCity] = useState(address?.city ?? 'Краснодар')
  const [street, setStreet] = useState(address?.street ?? '')
  const dialogRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const nearestDeliveryTime = getNearestDeliveryTimeLabel()

  useEffect(() => {
    if (isAddressOpen) {
      setCity(address?.city ?? 'Краснодар')
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
        closeAddress()
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
  }, [closeAddress, isAddressOpen])

  if (!isAddressOpen) return null

  return (
    <div className="sheet-overlay" role="presentation">
      <button
        type="button"
        className="sheet-overlay__backdrop"
        aria-label="Закрыть выбор адреса"
        onClick={closeAddress}
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
            onClick={closeAddress}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <label className="field-label" htmlFor="delivery-city">
          Город
        </label>
        <div className="select-field">
          <MapPin aria-hidden="true" />
          <select
            id="delivery-city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            <option>Краснодар</option>
            <option>Сочи</option>
            <option>Новороссийск</option>
          </select>
          <ChevronDown aria-hidden="true" />
        </div>

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
            confirmAddress({
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
