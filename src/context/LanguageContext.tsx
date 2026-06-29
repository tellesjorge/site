import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'pt' | 'en'

type TranslationSource = {
  pt: string
  en: string
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (source: TranslationSource | string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load saved language, default to browser settings or 'pt'
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('jorge-telles-language')
      if (saved === 'pt' || saved === 'en') return saved
      
      const browserLang = navigator.language.slice(0, 2)
      return browserLang === 'en' ? 'en' : 'pt'
    } catch {
      return 'pt'
    }
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('jorge-telles-language', lang)
    } catch {
      // ignore
    }
  }

  // Translation helper
  const t = (source: TranslationSource | string): string => {
    if (typeof source === 'string') return source
    return source[language] || source['pt'] || ''
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
