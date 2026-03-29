'use client'

import React from 'react'
import { translations, type Lang, type T } from './translations'

type LanguageContextValue = {
  lang: Lang
  setLanguage: (l: Lang) => void
  t: T
}

const LanguageContext = React.createContext<LanguageContextValue>({
  lang: 'es',
  setLanguage: () => {},
  t: translations.es,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>('es')
  const [fading, setFading] = React.useState(false)

  // Detect language once on mount (client-side only)
  React.useEffect(() => {
    const saved = localStorage.getItem('gde-lang') as Lang | null
    if (saved === 'es' || saved === 'en') {
      setLang(saved)
      return
    }
    const browser = navigator.language ?? ''
    setLang(browser.startsWith('es') ? 'es' : 'en')
  }, [])

  const setLanguage = React.useCallback((l: Lang) => {
    setFading(true)
    setTimeout(() => {
      setLang(l)
      localStorage.setItem('gde-lang', l)
      setFading(false)
    }, 180)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t: translations[lang] as T }}>
      <div style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.18s ease' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return React.useContext(LanguageContext)
}
