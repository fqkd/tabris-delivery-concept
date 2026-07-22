import { Minus, Plus } from 'lucide-react'

type QuantityControlProps = {
  quantity: number
  onChange: (quantity: number) => void
  compact?: boolean
  label?: string
}

export function QuantityControl({
  quantity,
  onChange,
  compact = false,
  label = 'Количество товара',
}: QuantityControlProps) {
  return (
    <div
      className={`quantity-control${compact ? ' quantity-control--compact' : ''}`}
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Уменьшить количество"
        onClick={() => onChange(quantity - 1)}
      >
        <Minus aria-hidden="true" />
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        type="button"
        aria-label="Увеличить количество"
        onClick={() => onChange(quantity + 1)}
      >
        <Plus aria-hidden="true" />
      </button>
    </div>
  )
}
