import {
  Heart,
  Home,
  LayoutGrid,
  ShoppingBag,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

type NavItem = {
  label: string
  path: string
  icon: LucideIcon
  isActive: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    label: 'Главная',
    path: '/',
    icon: Home,
    isActive: (pathname) => pathname === '/',
  },
  {
    label: 'Каталог',
    path: '/category/own-production',
    icon: LayoutGrid,
    isActive: (pathname) => pathname.startsWith('/category'),
  },
  {
    label: 'Избранное',
    path: '/section/favorites',
    icon: Heart,
    isActive: (pathname) => pathname === '/section/favorites',
  },
  {
    label: 'Корзина',
    path: '/cart',
    icon: ShoppingBag,
    isActive: (pathname) => pathname === '/cart',
  },
  {
    label: 'Профиль',
    path: '/section/profile',
    icon: UserRound,
    isActive: (pathname) => pathname === '/section/profile',
  },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useShop()

  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = item.isActive(location.pathname)

        return (
          <button
            key={item.path}
            type="button"
            className={active ? 'is-active' : undefined}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(item.path)}
          >
            <span className="bottom-nav__icon">
              <Icon aria-hidden="true" />
              {item.path === '/cart' && cartCount > 0 && (
                <span className="bottom-nav__badge" aria-label={`${cartCount} товаров`}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
