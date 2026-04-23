"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Award, Users, Globe, BookOpen, GraduationCap, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const stats = [
  { value: "500+", labelKey: "about.stats.students", icon: Users },
  { value: "24", labelKey: "about.stats.courses", icon: BookOpen },
  { value: "6", labelKey: "about.stats.experience", icon: Award }
];

const values = [
  { icon: GraduationCap, titleKey: "about.values.authentic.title", descKey: "about.values.authentic.desc" },
  { icon: Heart, titleKey: "about.values.studentCentered.title", descKey: "about.values.studentCentered.desc" },
  { icon: Globe, titleKey: "about.values.global.title", descKey: "about.values.global.desc" },
  { icon: Award, titleKey: "about.values.excellence.title", descKey: "about.values.excellence.desc" }
];

const methodology = [
  { step: "01", titleKey: "about.methodology.oneToOne.title", descKey: "about.methodology.oneToOne.desc" },
  { step: "02", titleKey: "about.methodology.structured.title", descKey: "about.methodology.structured.desc" },
  { step: "03", titleKey: "about.methodology.flexible.title", descKey: "about.methodology.flexible.desc" },
  { step: "04", titleKey: "about.methodology.recorded.title", descKey: "about.methodology.recorded.desc" },
  { step: "05", titleKey: "about.methodology.tracking.title", descKey: "about.methodology.tracking.desc" },
  { step: "06", titleKey: "about.methodology.certification.title", descKey: "about.methodology.certification.desc" }
];

// Floating particles for background - generated client-side to avoid hydration mismatch
interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export default function AboutPage() {
  const { t, isRTL, language } = useTranslation();
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    setParticles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 15 + Math.random() * 10
      }))
    );
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Header - Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero.png"
            alt={t("about.heroAlt") || "About Us"}
            fill
            className="object-cover"
            priority
          />
          
          {/* Gradient Overlay - Enhanced with multiple layers */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(13, 77, 47, 0.92) 0%, rgba(26, 122, 74, 0.88) 30%, rgba(13, 77, 47, 0.92) 100%)"
            }}
          />

          {/* Radial Glow Effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, transparent 60%)"
            }}
          />

          {/* Animated Islamic Geometric Overlay */}
          <div className="absolute inset-0 opacity-15">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="about-hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path
                    d="M60 0L120 30L120 90L60 120L0 90L0 30Z"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M60 15L105 30L105 90L60 105L15 90L15 30Z"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="0.4"
                  />
                  <circle cx="60" cy="60" r="20" fill="none" stroke="#C9A84C" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#about-hero-pattern)" />
            </svg>
          </div>

          {/* Floating Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full bg-[#C9A84C]/30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-center"
          >
            {/* Bismillah */}
            <motion.div
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <p className="arabic-text text-[#C9A84C] text-2xl md:text-3xl lg:text-4xl leading-relaxed relative">
                <span className="absolute -inset-4 bg-[#C9A84C]/10 rounded-full blur-xl" />
                <span className="relative">{t("hero.bismillah")}</span>
              </p>
            </motion.div>

            {/* Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] text-sm font-semibold uppercase tracking-wider">
                {t("about.subtitle") || "About Us"}
              </span>
            </motion.div>

            {/* Main Title with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 ${isRTL ? "arabic-text" : ""}`}
              style={{
                textShadow: "0 4px 30px rgba(0,0,0,0.5)"
              }}
            >
              <span className="bg-gradient-to-r from-white via-white to-[#C9A84C] bg-clip-text text-transparent">
                {t("about.title")}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isRTL ? "arabic-text" : ""}`}
            >
              {t("about.description")}
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          className="absolute bottom-20 left-10 w-24 h-24"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="absolute inset-0 border border-[#C9A84C]/20 rounded-full animate-rotate-slow" />
          <div className="absolute inset-2 border border-[#C9A84C]/10 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
        </motion.div>

        <motion.div 
          className="absolute top-40 right-10 w-32 h-32"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="absolute inset-0 border border-[#C9A84C]/10 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse" }} />
          <div className="absolute inset-4 border border-[#C9A84C]/5 rounded-full animate-rotate-slow" style={{ animationDuration: "25s" }} />
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? "lg:grid-flow-dense" : ""}`}>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={isRTL ? "lg:col-start-2" : ""}
            >
              <h2 className={`text-[var(--text-primary)] text-3xl font-bold font-display mb-6 ${isRTL ? "arabic-text text-right" : ""}`}>
                {t("about.missionVision.title")}
              </h2>
              <div className={`space-y-4 text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text text-right" : ""}`}>
                <p>
                  <strong className="text-[var(--text-primary)]">{t("about.mission.title")}:</strong> {t("about.mission.text")}
                </p>
                <p>
                  <strong className="text-[var(--text-primary)]">{t("about.vision.title")}:</strong> {t("about.vision.text")}
                </p>
                <p>
                  {t("about.belief")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={isRTL ? "lg:col-start-1" : ""}
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-[var(--primary-soft)] flex items-center justify-center p-8">
                <div className="relative w-full h-full">
                  <Image
                    src="/logo.png"
                    alt={t("about.logoAlt") || "Al-Itqan Institute Logo"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scholar Profile */}
      <section className="py-20 bg-[var(--background-green)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-[var(--gold)] text-sm font-semibold uppercase tracking-wider">
              {t("about.scholar.subtitle")}
            </span>
            <h2 className={`text-[var(--text-primary)] text-3xl md:text-4xl font-bold font-display mt-3 ${isRTL ? "arabic-text" : ""}`}>
              {t("about.scholar.title")}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--border)] max-w-4xl mx-auto"
          >
            <div className={`flex flex-col md:flex-row gap-8 items-center ${isRTL ? "md:flex-row-reverse" : ""}`}>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-[var(--gold)] ring-offset-4 ring-offset-[var(--background-green)] shadow-xl">
                <Image
                  src="/Dr_Noorurrahman_hazarvi.jpeg"
                  alt={t("about.scholar.name")}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              
              <div className={`text-center md:text-left ${isRTL ? "md:text-right" : ""}`}>
                <h3 className={`text-[var(--text-primary)] text-2xl md:text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {t("about.scholar.name")}
                </h3>
                <p className="text-[var(--gold)] font-semibold mb-4 arabic-text">
                  {language === "en" ? "(Hafizahullah)" : language === "ar" ? "حفظه الله" : "حفظہ اللہ"}
                </p>

                <div className={`space-y-2 text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                  <p className={`flex items-center gap-2 ${isRTL ? "justify-center md:justify-end flex-row-reverse" : "justify-center md:justify-start"}`}>
                    <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-bold text-[var(--text-primary)]">{t("about.scholar.credentials.phd")}</span>
                  </p>
                  <p className={`flex items-center gap-2 ${isRTL ? "justify-center md:justify-end flex-row-reverse" : "justify-center md:justify-start"}`}>
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-bold text-[var(--text-primary)]">{t("about.scholar.credentials.kharij")}</span>
                  </p>
                  <p className={`flex items-center gap-2 ${isRTL ? "justify-center md:justify-end flex-row-reverse" : "justify-center md:justify-start"}`}>
                    <Award className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-bold text-[var(--text-primary)]">{t("about.scholar.credentials.doctorate")}</span>
                  </p>
                  <p className={`flex items-center gap-2 ${isRTL ? "justify-center md:justify-end flex-row-reverse" : "justify-center md:justify-start"}`}>
                    <Award className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-lg">{t("about.scholar.credentials.rashidHead")}</span>
                  </p>
                  <p className={`flex items-center gap-2 ${isRTL ? "justify-center md:justify-end flex-row-reverse" : "justify-center md:justify-start"}`}>
                    <Award className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-lg">{t("about.scholar.credentials.haqqaniaMember")}</span>
                  </p>
                  <p className={`flex items-center gap-2 ${isRTL ? "justify-center md:justify-end flex-row-reverse" : "justify-center md:justify-start"}`}>
                    <Award className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-lg">{t("about.scholar.credentials.ghazaliCoordinator")}</span>
                  </p>
                  <p className={`flex items-center gap-2 ${isRTL ? "justify-center md:justify-end flex-row-reverse" : "justify-center md:justify-start"}`}>
                    <Award className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-lg">{t("about.scholar.credentials.expertise")}</span>
                  </p>
                </div>

                {/* Scholarly Recognition Highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 p-4 bg-gradient-to-r from-[var(--gold)]/10 to-transparent rounded-xl border-l-4 border-[var(--gold)]"
                >
                  <p className={`text-[var(--text-secondary)] text-sm italic ${isRTL ? "arabic-text" : ""}`}>
                    {t("about.scholar.recognition")}
                  </p>
                </motion.div>

                {/* Contact CTA - Enhanced Professional WhatsApp Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6"
                >
                  <a
                    href="https://wa.me/923434487450"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl hover:from-[#128C7E] hover:to-[#075E54] transition-all duration-300 text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.742.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    {t("about.scholar.contactWhatsApp")}
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.introTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.intro")}
              </p>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.educationTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.education")}
              </p>
            </motion.div>

            {/* Teaching Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.teachingTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.teaching")}
              </p>
            </motion.div>

            {/* Current Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.currentTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.current")}
              </p>
            </motion.div>

            {/* Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.expertiseTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.expertise")}
              </p>
            </motion.div>

            {/* Research & Publications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.researchTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.research")}
              </p>
            </motion.div>

            {/* Research Supervision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.supervisionTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.supervision")}
              </p>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.languagesTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.languages")}
              </p>
            </motion.div>

            {/* Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[var(--primary)]/10 rounded-2xl p-6 md:p-8 border border-[var(--primary)]/20"
            >
              <h3 className={`text-[var(--primary)] text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.conclusionTitle")}
              </h3>
              <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                {t("about.scholar.fullBio.conclusion")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-[var(--gold)] text-sm font-semibold uppercase tracking-wider">
              {t("about.values.subtitle")}
            </span>
            <h2 className={`text-[var(--text-primary)] text-3xl md:text-4xl font-bold font-display mt-3 ${isRTL ? "arabic-text" : ""}`}>
              {t("about.values.title")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-[var(--border)] text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-[var(--primary)]" />
                </div>
                <h3 className={`text-[var(--text-primary)] font-bold text-lg mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {t(value.titleKey)}
                </h3>
                <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>
                  {t(value.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[var(--primary-dark)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-[#C9A84C] mx-auto mb-4" />
                <p className="text-4xl md:text-5xl font-bold text-[#C9A84C] font-display mb-2">
                  {stat.value}
                </p>
                <p className={`text-white/80 ${isRTL ? "arabic-text" : ""}`}>{t(stat.labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-20 bg-[var(--background-green)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className={`text-[var(--text-primary)] text-3xl md:text-4xl font-bold font-display mb-4 ${isRTL ? "arabic-text" : ""}`}>
              {t("about.methodology.title")}
            </h2>
            <p className={`text-[var(--text-secondary)] max-w-2xl mx-auto ${isRTL ? "arabic-text" : ""}`}>
              {t("about.methodology.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodology.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-card p-6 rounded-2xl border border-[var(--border)] relative ${isRTL ? "arabic-text" : ""}`}
              >
                <span className={`absolute top-4 text-5xl font-bold text-[var(--primary)]/10 ${isRTL ? "left-4" : "right-4"}`}>
                  {item.step}
                </span>
                <h3 className="text-[var(--text-primary)] font-bold text-lg mb-2 relative z-10">
                  {t(item.titleKey)}
                </h3>
                <p className="text-[var(--text-muted)] text-sm relative z-10">
                  {t(item.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
