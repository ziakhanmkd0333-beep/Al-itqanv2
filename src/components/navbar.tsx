"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "@/hooks/use-translation";

export function Navbar() {
  const { t, isRTL, isMounted } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const navLinks = [
    { href: "/", label: isMounted ? t("nav.home") : "Home", icon: "🏠" },
    { href: "/courses", label: isMounted ? t("nav.courses") : "Courses", icon: "📚" },
    { href: "/about", label: isMounted ? t("nav.about") : "About", icon: "ℹ️" },
    { href: "/admission", label: isMounted ? t("nav.admission") : "Admission", icon: "🎓" },
    { href: "/contact", label: isMounted ? t("nav.contact") : "Contact", icon: "📞" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3"
          : "py-4"
      }`}
    >
      {/* Glassmorphism Background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isScrolled
          ? "bg-[var(--background)]/80 backdrop-blur-xl shadow-lg border-b border-[var(--border)]/50"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`} />

      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-14 md:h-16" : "h-16 md:h-20"
        }`}>
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-10 h-10 md:w-12 md:h-12"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow Ring */}
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--gold)]/30 via-[var(--primary)]/30 to-[var(--gold)]/30 blur-md"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-[var(--gold)]/30 group-hover:ring-[var(--gold)] transition-all duration-300">
                <Image
                  src="/logo.png"
                  alt="Al-Itqan Institute Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
            <div className="hidden md:block">
              <motion.h1
                className={`text-white drop-shadow-md font-brand font-bold text-sm md:text-base leading-tight group-hover:text-[var(--gold)] transition-colors duration-300 ${isRTL ? "arabic-text" : ""}`}
              >
                {isMounted ? t("nav.brandName") : "Al-Itqan Institute"}
              </motion.h1>
              <p className={`text-white/80 drop-shadow-md text-xs flex items-center gap-1 ${isRTL ? "arabic-text" : ""}`}>
                <Sparkles className="w-3 h-3 text-[var(--gold)]" />
                {isMounted ? t("nav.brandTagline") : "Excellence in Learning"}
              </p>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setActiveLink(link.href)}
                className="relative px-4 py-2 text-sm font-medium group"
              >
                <span className={`relative z-10 transition-colors duration-300 drop-shadow-md ${
                  activeLink === link.href
                    ? "text-[var(--gold)]"
                    : "text-white/90 group-hover:text-[var(--gold)]"
                }`}>
                  {link.label}
                </span>
                {/* Hover Background */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                />
                {/* Active Indicator */}
                {activeLink === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--gold)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Enhanced Right Section */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--background)]/50 backdrop-blur-sm border border-[var(--border)]/50">
              <LanguageSwitcher />
              <div className="w-px h-5 bg-[var(--border)]" />
              <ThemeToggle />
            </div>
            
            {/* Login Button */}
            <Link
              href="/auth/login"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-white/90 hover:text-[var(--gold)] text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-xl drop-shadow-md"
            >
              {t("nav.login")}
            </Link>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/admission"
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:from-[var(--gold-dark)] hover:to-[var(--gold)] text-[var(--primary-dark)] px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-4 h-4" />
                {t("nav.applyNow")}
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2.5 rounded-xl bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)] text-[var(--text-primary)] hover:text-[var(--primary)] hover:border-[var(--gold)]/50 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="mx-4 mt-2 bg-[var(--background)]/95 backdrop-blur-xl rounded-2xl border border-[var(--border)]/50 shadow-2xl overflow-hidden">
              <div className="p-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)] transition-all duration-300 font-medium"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
                
                <div className="pt-3 mt-3 border-t border-[var(--border)]/50 space-y-2">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-[var(--text-muted)]">Settings</span>
                    <div className="flex items-center gap-2">
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium rounded-xl hover:bg-[var(--primary)]/5 transition-all"
                    >
                      {t("nav.login")}
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href="/admission"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 text-center bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-[var(--primary-dark)] rounded-xl font-semibold shadow-lg"
                    >
                      {t("nav.applyNow")}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
