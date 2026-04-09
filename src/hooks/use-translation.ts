"use client";

import { useCallback } from "react";
import { useLanguage } from "@/context/language-context";
import { getTranslation, type Language } from "@/i18n/translations";

export function useTranslation() {
  const { language, isRTL, dir, isMounted } = useLanguage();

  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  return {
    t,
    language,
    isRTL,
    dir,
    isMounted,
  };
}

export function useTranslate(lang?: Language) {
  const { language: currentLang, isMounted } = useLanguage();
  const targetLang = lang || currentLang;

  const t = useCallback((key: string) => getTranslation(targetLang, key), [targetLang]);

  return { t, isMounted };
}
