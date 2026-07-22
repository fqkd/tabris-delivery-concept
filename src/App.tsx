import { useEffect } from 'react'
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
import { ShopProvider } from './context/ShopProvider'
import { CartPage } from './pages/CartPage'
import { CategoryPage } from './pages/CategoryPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'

function AppFrame() {
  const location = useLocation()
  const showBottomNav = !location.pathname.startsWith('/product/')

  useEffect(() => {
    document.querySelector('.app-scroll')?.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <div className="app-scroll">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/own-production" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/section/:sectionId" element={<ComingSoonPage />} />
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
