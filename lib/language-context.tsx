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

  React.useEffect(() => {
    const saved = localStorage.getItem('gde-lang') as Lang | null
    if (saved === 'es' || saved === 'en') { setLang(saved); return }
    const browser = navigator.language ?? ''
    setLang(browser.startsWith('es') ? 'es' : 'en')
  }, [])

  const setLanguage = React.useCallback((l: Lang) => {
    setLang(l)
    localStorage.setItem('gde-lang', l)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t: translations[lang] as T }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return React.useContext(LanguageContext)
}
