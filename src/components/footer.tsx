"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Facebook, Youtube, Instagram, MessageCircle,
  ExternalLink, Heart, ArrowUpRight
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function Footer() {
  const { t, isRTL } = useTranslation();

  const quickLinks = [
    { href: "/", label: t("nav.home"), icon: ArrowUpRight },
    { href: "/about", label: t("nav.about"), icon: ArrowUpRight },
    { href: "/courses", label: t("nav.courses"), icon: ArrowUpRight },
    { href: "/admission", label: t("nav.admission"), icon: ArrowUpRight },
    { href: "/contact", label: t("nav.contact"), icon: ArrowUpRight }
  ];

  const programs = [
    { key: "nooraniQaida" },
    { key: "quranNazraTajweed" },
    { key: "hifzQuran" },
    { key: "tarjumaTafseer" },
    { key: "arabicLanguage" },
    { key: "fiqhUsool" },
    { key: "hadithSciences" },
    { key: "takhassus" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: MessageCircle, href: "#", label: "WhatsApp", color: "hover:bg-green-600" }
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Top Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[var(--background)] to-transparent" />

      {/* Main Footer */}
      <div className="relative bg-gradient-to-b from-[var(--primary-dark)] to-[var(--primary)] text-white pt-24 pb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Brand Section - Larger */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link href="/" className="flex items-center gap-4 mb-6 group">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[var(--gold)]/30 group-hover:ring-[var(--gold)] transition-all duration-300 shadow-lg">
                    <Image
                      src="/logo.png"
                      alt="Al-Itqan Institute Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-brand font-bold text-xl text-white group-hover:text-[var(--gold)] transition-colors">
                      {t("nav.brandName")}
                    </h3>
                    <p className="text-white/50 text-xs">{t("footer.subtitle")}</p>
                  </div>
                </Link>

                <p className={`text-white/60 text-sm leading-relaxed mb-6 max-w-sm ${isRTL ? "arabic-text" : ""}`}>
                  {t("footer.tagline")}
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-11 h-11 rounded-xl bg-white/10 ${social.color} flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-transparent`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <h4 className="font-bold text-lg mb-6 text-[var(--gold)] flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-[var(--gold)]" />
                  {t("footer.quickLinks")}
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`group flex items-center gap-2 text-white/60 hover:text-[var(--gold)] transition-all duration-300 text-sm ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <link.icon className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Programs */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h4 className={`font-bold text-lg mb-6 text-[var(--gold)] flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="w-8 h-0.5 bg-[var(--gold)]" />
                  {t("footer.ourPrograms")}
                </h4>
                <ul className="space-y-2">
                  {programs.map((program, index) => (
                    <motion.li
                      key={program.key}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/50" />
                      <span className={`text-white/60 text-sm hover:text-[var(--gold)] transition-colors cursor-default ${isRTL ? "arabic-text" : ""}`}>{t(`footer.programs.${program.key}`)}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h4 className="font-bold text-lg mb-6 text-[var(--gold)] flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-[var(--gold)]" />
                  {t("footer.contact")}
                </h4>
                <ul className="space-y-4">
                  <li className={`flex items-start gap-3 group ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[var(--gold)]/20 transition-colors">
                      <Mail className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">{t("footer.contactLabels.email")}</p>
                      <a href="mailto:waqas@alnooronlineacademy.com" className="text-white/80 hover:text-[var(--gold)] transition-colors text-sm">
                        waqas@alnooronlineacademy.com
                      </a>
                    </div>
                  </li>
                  <li className={`flex items-start gap-3 group ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[var(--gold)]/20 transition-colors">
                      <Phone className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">{t("footer.contactLabels.phone")}</p>
                      <a href="tel:+923434487450" className="text-white/80 hover:text-[var(--gold)] transition-colors text-sm">
                        +923434487450
                      </a>
                    </div>
                  </li>
                  <li className={`flex items-start gap-3 group ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[var(--gold)]/20 transition-colors">
                      <MapPin className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <div className={isRTL ? "text-right" : ""}>
                      <p className="text-white/40 text-xs mb-0.5">{t("footer.contactLabels.location")}</p>
                      <span className={`text-white/80 text-sm ${isRTL ? "arabic-text" : ""}`}>{t("footer.onlineClasses")}</span>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className={`text-white/40 text-xs flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-[var(--gold)]">{t("footer.languages")}:</span>
                    <span className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      {[
                        { code: "en", label: t("languages.en") },
                        { code: "ur", label: t("languages.ur") },
                        { code: "ar", label: t("languages.ar") }
                      ].map((lang) => (
                        <span key={lang.code} className={`px-2 py-0.5 rounded bg-white/10 text-white/60 ${isRTL && lang.code !== "en" ? "arabic-text" : ""}`}>{lang.label}</span>
                      ))}
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className={`text-white/40 text-sm flex items-center gap-1 ${isRTL ? "md:text-right arabic-text" : "md:text-left"}`}
              >
                © {new Date().getFullYear()} {t("footer.rights")}
                <span className="inline-flex items-center gap-1 ml-2">
                  {t("footer.madeWith")} <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {t("footer.forUmmah")}
                </span>
              </motion.p>
              <div className={`flex gap-6 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                {[
                  { href: "/privacy", label: t("footer.privacyPolicy") },
                  { href: "/terms", label: t("footer.termsService") }
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-[var(--gold)] transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
