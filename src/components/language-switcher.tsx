"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, type Language } from "@/context/language-context";
import { getTranslation } from "@/i18n/translations";
import { Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "ar", label: "AR", flag: "🇸🇦" },
  { code: "ur", label: "UR", flag: "🇵🇰" },
];

export function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--gold)] transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4 text-[var(--gold)]" />
        <span className="text-sm font-medium" suppressHydrationWarning>{currentLang.flag}</span>
        <span className="text-sm font-medium hidden sm:inline" suppressHydrationWarning>{currentLang.label}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${isRTL ? "left-0" : "right-0"} top-full mt-2 w-40 bg-card border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50`}
            role="listbox"
            aria-label="Language options"
          >
            <div className="p-1">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    language === lang.code
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--primary)]/5"
                  }`}
                  whileHover={{ x: isRTL ? -2 : 2 }}
                  role="option"
                  aria-selected={language === lang.code}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg" suppressHydrationWarning>{lang.flag}</span>
                    <span className="font-medium">
                      {lang.code === 'ur' ? 'اردو' : t(`languages.${lang.code}`)}
                    </span>
                  </div>
                  {language === lang.code && (
                    <Check className="w-4 h-4 text-[var(--primary)]" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
