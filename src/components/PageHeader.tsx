import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

type PageHeaderProps = {
  title: string
  backTo?: string
  showCart?: boolean
}

export function PageHeader({
  title,
  backTo = '/',
  showCart = true,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const { cartCount } = useShop()

  return (
    <header className="page-header">
      <button
        type="button"
        className="icon-button"
        aria-label="Назад"
        onClick={() => navigate(backTo)}
      >
        <ArrowLeft aria-hidden="true" />
      </button>
      <h1>{title}</h1>
      {showCart ? (
        <button
          type="button"
          className="icon-button icon-button--badged"
          aria-label="Открыть корзину"
          onClick={() => navigate('/cart')}
        >
          <ShoppingBag aria-hidden="true" />
          {cartCount > 0 && <span>{cartCount > 9 ? '9+' : cartCount}</span>}
        </button>
      ) : (
        <span className="page-header__spacer" aria-hidden="true" />
      )}
    </header>
  )
}
