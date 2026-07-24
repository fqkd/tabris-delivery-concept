import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

type PageHeaderProps = {
  title: string
  backTo?: string
  showCart?: boolean
  onBack?: () => void
  headingLevel?: 1 | 2 | 'none'
}

export function PageHeader({
  title,
  backTo,
  showCart = true,
  onBack,
  headingLevel = 1,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount } = useShop()

  return (
    <header className="page-header">
      <button
        type="button"
        className="icon-button"
        aria-label="Назад"
        onClick={() => {
          if (onBack) onBack()
          else if (backTo) navigate(backTo)
          else navigate(-1)
        }}
      >
        <ArrowLeft aria-hidden="true" />
      </button>
      {headingLevel === 'none' ? (
        <span className="page-header__title">{title}</span>
      ) : headingLevel === 2 ? (
        <h2>{title}</h2>
      ) : (
        <h1>{title}</h1>
      )}
      {showCart ? (
        <button
          type="button"
          className="icon-button icon-button--badged"
          aria-label="Открыть корзину"
          onClick={() =>
            navigate('/cart', {
              state: {
                from: `${location.pathname}${location.search}`,
              },
            })
          }
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
