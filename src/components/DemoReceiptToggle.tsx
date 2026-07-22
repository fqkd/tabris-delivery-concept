import { ReceiptText } from 'lucide-react'
import { useId } from 'react'
import { useShop } from '../context/ShopContext'

type DemoReceiptToggleProps = {
  description?: string
}

export function DemoReceiptToggle({
  description = 'Получать чеки в приложении вместо бумажных',
}: DemoReceiptToggleProps) {
  const descriptionId = useId()
  const { electronicReceipts, setElectronicReceipts } = useShop()

  return (
    <label className="demo-receipt-toggle">
      <span className="demo-receipt-toggle__icon" aria-hidden="true">
        <ReceiptText />
      </span>
      <span className="demo-receipt-toggle__copy">
        <strong>Электронные чеки</strong>
        <small id={descriptionId}>{description}</small>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={electronicReceipts}
        aria-describedby={descriptionId}
        onChange={(event) => setElectronicReceipts(event.target.checked)}
      />
      <span className="demo-receipt-toggle__control" aria-hidden="true">
        <span />
      </span>
    </label>
  )
}
