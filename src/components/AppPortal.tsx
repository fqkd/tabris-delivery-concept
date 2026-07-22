import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type AppPortalProps = {
  children: ReactNode
}

export function AppPortal({ children }: AppPortalProps) {
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    setTarget(document.querySelector('.app-shell'))
  }, [])

  return target ? createPortal(children, target) : null
}
