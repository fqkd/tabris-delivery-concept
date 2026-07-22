import {
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Navigation,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useShop } from '../context/ShopContext'

export function AddressSheet() {
  const {
    address,
    isAddressOpen,
    closeAddress,
    confirmAddress,
  } = useShop()
  const [city, setCity] = useState(address.city)
  const [street, setStreet] = useState(address.street)

  useEffect(() => {
    if (isAddressOpen) {
      setCity(address.city)
      setStreet(address.street)
    }
  }, [address.city, address.street, isAddressOpen])

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
            id="delivery-address"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            placeholder="Улица и дом"
          />
        </div>

        <button
          type="button"
          className="saved-address"
          onClick={() => setStreet('ул. Красная, 202')}
        >
          <span className="saved-address__icon">
            <Check aria-hidden="true" />
          </span>
          <span>
            <strong>ул. Красная, 202</strong>
            <small>Демонстрационный адрес</small>
          </span>
        </button>

        <div className="delivery-slot">
          <Clock3 aria-hidden="true" />
          <span>
            <small>Ближайшая доставка</small>
            <strong>{address.deliveryTime}</strong>
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
              deliveryTime: address.deliveryTime,
            })
          }
        >
          Доставить сюда
        </button>
      </section>
    </div>
  )
}
