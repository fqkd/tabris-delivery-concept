import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CasePage } from './case/CasePage'
import './case.css'

createRoot(document.getElementById('case-root')!).render(
  <StrictMode>
    <CasePage />
  </StrictMode>,
)
