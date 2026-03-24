"use client";

import { useLanguage } from "@/context/language-context";
import { getTranslation, type Language } from "@/i18n/translations";

export function useTranslation() {
  const { language, isRTL, dir } = useLanguage();

  const t = (key: string) => getTranslation(language, key);

  return {
    t,
    language,
    isRTL,
    dir,
  };
}

export function useTranslate(lang?: Language) {
  const { language: currentLang } = useLanguage();
  const targetLang = lang || currentLang;

  const t = (key: string) => getTranslation(targetLang, key);

  return { t };
}
