'use client'

import React from 'react'

type ExpertModalContextValue = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ExpertModalContext = React.createContext<ExpertModalContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
})

export function ExpertModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const openModal = React.useCallback(() => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = React.useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])

  return (
    <ExpertModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ExpertModalContext.Provider>
  )
}

export function useExpertModal() {
  return React.useContext(ExpertModalContext)
}
