import { useLayoutEffect, useRef } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import './App.css'
import { AddressSheet } from './components/AddressSheet'
import { BottomNav } from './components/BottomNav'
import { useShop } from './context/ShopContext'
import { ShopProvider } from './context/ShopProvider'
import { BonusPage } from './pages/BonusPage'
import { CartPage } from './pages/CartPage'
import { CatalogPage } from './pages/CatalogPage'
import { CategoryPage } from './pages/CategoryPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { DinnerBuilderPage } from './pages/DinnerBuilderPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'
import { ProductPage } from './pages/ProductPage'
import { ProfilePage } from './pages/ProfilePage'
import { TrackingPage } from './pages/TrackingPage'

const bottomNavPaths = new Set([
  '/',
  '/catalog',
  '/category/own-production',
  '/favorites',
  '/cart',
  '/profile',
  '/bonus',
  '/dinner',
])

function ScrollManager() {
  const location = useLocation()
  const { search, setSearchScrollTop } = useShop()
  const savedCatalogScroll = useRef(search.scrollTop)
  const lastKnownCatalogScroll = useRef(search.scrollTop)
  const saveCatalogScroll = useRef(setSearchScrollTop)

  savedCatalogScroll.current = search.scrollTop
  saveCatalogScroll.current = setSearchScrollTop

  useLayoutEffect(() => {
    const scroller = document.querySelector<HTMLElement>('.app-scroll')
    if (!scroller) return

    const catalogRoute = location.pathname === '/catalog'
    scroller.scrollTo({ top: catalogRoute ? savedCatalogScroll.current : 0 })

    if (!catalogRoute) return

    lastKnownCatalogScroll.current = scroller.scrollTop
    const rememberScroll = () => {
      lastKnownCatalogScroll.current = scroller.scrollTop
    }
    scroller.addEventListener('scroll', rememberScroll, { passive: true })

    return () => {
      scroller.removeEventListener('scroll', rememberScroll)
      saveCatalogScroll.current(lastKnownCatalogScroll.current)
    }
  }, [location.pathname])

  return null
}

function AppFrame() {
  const location = useLocation()
  const showBottomNav = bottomNavPaths.has(location.pathname)

  return (
    <div className="app-shell">
      <div className="app-scroll">
        <ScrollManager />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/category/own-production" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/dinner" element={<DinnerBuilderPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:orderId/success" element={<OrderSuccessPage />} />
          <Route path="/orders/:orderId/tracking" element={<TrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bonus" element={<BonusPage />} />
          <Route path="/section/search" element={<Navigate to="/catalog" replace />} />
          <Route path="/section/favorites" element={<Navigate to="/favorites" replace />} />
          <Route path="/section/profile" element={<Navigate to="/profile" replace />} />
          <Route path="/section/bonus" element={<Navigate to="/bonus" replace />} />
          <Route path="/section/:sectionId" element={<Navigate to="/catalog" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showBottomNav && <BottomNav />}
      <AddressSheet />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AppFrame />
      </ShopProvider>
    </BrowserRouter>
  )
}

export default App
