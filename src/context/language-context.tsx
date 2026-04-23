"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ar" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  dir: "ltr" | "rtl";
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const RTL_LANGUAGES: Language[] = ["ar", "ur"];

// Get initial language from localStorage (for client-side only)
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem("alnoor-language") as Language;
  if (stored && ["en", "ar", "ur"].includes(stored)) {
    return stored;
  }
  return 'en';
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Re-validate language after mount to ensure sync
    const stored = localStorage.getItem("alnoor-language") as Language;
    if (stored && ["en", "ar", "ur"].includes(stored) && stored !== language) {
      setLanguageState(stored);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("alnoor-language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? "rtl" : "ltr";
  };

  const isRTL = RTL_LANGUAGES.includes(language);
  const dir = isRTL ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, dir, isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
