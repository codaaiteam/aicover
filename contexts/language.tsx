'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

type Translations = {
  [key: string]: string
}

type LanguageContextType = {
  t: Translations
  currentLocale: string
}

const LanguageContext = createContext<LanguageContextType>({
  t: {},
  currentLocale: 'en'
})

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function LanguageProvider({
  children,
  defaultTranslations
}: {
  children: React.ReactNode
  defaultTranslations: Translations
}) {
  const params = useParams()
  const [currentLocale, setCurrentLocale] = useState('en')
  const [translations, setTranslations] = useState(defaultTranslations)

  useEffect(() => {
    const lang = (params?.lang as string) || 'en'
    setCurrentLocale(lang)
    
    // Load translations
    import(`@/locales/${lang}.json`)
      .then((module) => {
        setTranslations(module.default)
      })
      .catch(() => {
        console.warn(`Failed to load translations for ${lang}, falling back to default`)
        setTranslations(defaultTranslations)
      })
  }, [params, defaultTranslations])

  return (
    <LanguageContext.Provider value={{ t: translations, currentLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}
