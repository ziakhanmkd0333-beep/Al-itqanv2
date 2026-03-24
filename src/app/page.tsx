"use client";

import { useState } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturedCourses } from "@/components/featured-courses";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Users, Award, Globe, Shield, Star, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const featureIcons = [BookOpen, Users, Award, Globe, Shield, CheckCircle];

function WhyChooseUs() {
  const { t, isRTL } = useTranslation();

  const whyChooseUs = [
    {
      title: t("whyChooseUs.completeSyllabus"),
      description: t("whyChooseUs.completeSyllabusDesc") || "Complete structured curriculum from beginner to specialization level",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: t("whyChooseUs.scholarSupervision"),
      description: t("whyChooseUs.scholarSupervisionDesc") || "Learn under qualified scholars with authentic sanad-based teaching",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      title: t("whyChooseUs.oneToOne"),
      description: t("whyChooseUs.oneToOneDesc") || "Personal attention with one-to-one live classes and recorded lessons",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: t("whyChooseUs.progressTracking"),
      description: t("whyChooseUs.progressTrackingDesc") || "Track your progress with structured curriculum and certificates",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      title: t("whyChooseUs.multilingual"),
      description: t("whyChooseUs.multilingualDesc") || "Learn in English, Urdu, or Arabic with full RTL support",
      gradient: "from-rose-500 to-pink-600"
    },
    {
      title: t("whyChooseUs.secure"),
      description: t("whyChooseUs.secureDesc") || "Secure admission process with flexible payment plans",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-[var(--background)]">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-[var(--primary)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[var(--gold)]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-20"
        >
          {/* Decorative Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--gold)]/10 border border-[var(--primary)]/20 rounded-full px-5 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-[var(--primary)] text-sm font-semibold uppercase tracking-wider">
              {t("common.whyChooseUs") || "Why Choose Us"}
            </span>
            <Star className="w-4 h-4 text-[var(--gold)]" />
          </motion.div>

          <h2 className={`text-[var(--text-primary)] text-4xl md:text-5xl lg:text-6xl font-bold font-display mt-4 mb-6 leading-tight ${isRTL ? "arabic-text" : ""}`}>
            {t("whyChooseUs.title") || "Why Choose Us"}
          </h2>

          <p className={`text-[var(--text-secondary)] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
            {t("whyChooseUs.subtitle") || "Discover why thousands of students worldwide choose Al-NOOR Academy for their Islamic education journey"}
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--primary)]" />
            <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--primary)]" />
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((item, index) => {
            const IconComponent = featureIcons[index];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--primary)]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative h-full bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-[var(--border)] hover:border-[var(--gold)]/50 transition-all duration-500 overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} p-[2px] shadow-lg group-hover:shadow-xl transition-shadow duration-500`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-[var(--primary)] group-hover:text-[var(--gold)] transition-colors duration-500" />
                      </div>
                    </div>
                    {/* Floating particles */}
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-[var(--gold)]/30"
                    />
                  </div>

                  {/* Content */}
                  <h3 className={`text-[var(--text-primary)] font-bold text-xl mb-3 group-hover:text-[var(--gold)] transition-colors duration-300 ${isRTL ? "arabic-text" : ""}`}>
                    {item.title}
                  </h3>
                  <p className={`text-[var(--text-muted)] text-sm leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                    {item.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--primary)] flex items-center justify-center shadow-lg">
                      <ChevronRight className={`w-5 h-5 text-white ${isRTL ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--gold)]/5 to-transparent rounded-bl-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "24+", label: t("stats.courses") || "Courses" },
            { value: "5K+", label: t("stats.students") || "Students" },
            { value: "50+", label: t("stats.teachers") || "Teachers" },
            { value: "3", label: t("stats.languages") || "Languages" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="group text-center p-6 bg-card/40 backdrop-blur-sm rounded-2xl border border-[var(--border)] hover:border-[var(--gold)]/30 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--gold)] to-[var(--primary)] bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-[var(--text-muted)] text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LanguageSupportBanner() {
  const { t, isRTL } = useTranslation();
  
  return (
    <section className="py-8 bg-[var(--primary)]/5 border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-secondary)] ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{t("languages.availableIn") || "Available in:"}</span>
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--background)] border border-[var(--border)]">🇺🇸 {t("languages.en")}</span>
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--background)] border border-[var(--border)]" dir="rtl">🇸🇦 {t("languages.ar")}</span>
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--background)] border border-[var(--border)]" dir="rtl">🇵🇰 {t("languages.ur")}</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
        <FeaturedCourses />
        <WhyChooseUs />
        <LanguageSupportBanner />
        <Footer />
      </main>
    </>
  );
}
