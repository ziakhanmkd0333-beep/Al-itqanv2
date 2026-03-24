"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useMemo } from "react";

export function HeroSection() {
  const { t, isRTL } = useTranslation();

  // Floating particles for background - deterministic positions to avoid hydration mismatch
  const particles = useMemo(() => [
    { id: 0, x: 15, y: 20, delay: 0.5, duration: 18 },
    { id: 1, x: 75, y: 35, delay: 1.2, duration: 22 },
    { id: 2, x: 25, y: 65, delay: 0.8, duration: 20 },
    { id: 3, x: 85, y: 55, delay: 1.5, duration: 19 },
    { id: 4, x: 45, y: 80, delay: 0.3, duration: 21 },
    { id: 5, x: 60, y: 15, delay: 1.8, duration: 17 }
  ], []);

  return (
    <section className="relative min-h-[40vh] md:min-h-[45vh] flex items-center justify-center overflow-hidden py-6 md:py-8">
      {/* Video/Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay - Enhanced with multiple layers */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(13, 77, 47, 0.9) 0%, rgba(26, 122, 74, 0.85) 30%, rgba(13, 77, 47, 0.9) 100%)"
          }}
        />

        {/* Radial Glow Effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, transparent 60%)"
          }}
        />
        
        {/* Animated Islamic Geometric Overlay - Enhanced */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
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

      {/* Content */}
      <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-6 pb-8 ${isRTL ? "text-right absolute right-0" : "text-left absolute left-0"}`}>
        {/* Bismillah - Always centered */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className={`mb-3 text-center`}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
          >
            <p className="arabic-text text-[#C9A84C] text-xl md:text-2xl lg:text-3xl leading-relaxed relative">
              <span className="absolute -inset-4 bg-[#C9A84C]/10 rounded-full blur-xl" />
              <span className="relative">{t("hero.bismillah")}</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className={`font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-3 md:mb-4 leading-tight max-w-2xl ${isRTL ? "arabic-text mr-0 ml-auto" : ""}`}
          style={{
            textShadow: "0 4px 30px rgba(0,0,0,0.5)"
          }}
        >
          <span className="bg-gradient-to-r from-white via-white to-[#C9A84C] bg-clip-text text-transparent">
            {t("hero.title")}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className={`text-lg md:text-xl lg:text-2xl text-white/95 mb-3 md:mb-4 font-bold max-w-2xl ${isRTL ? "arabic-text mr-0 ml-auto" : ""}`}
        >
          {t("hero.subtitle")}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className={`text-base md:text-lg text-white/90 mb-5 md:mb-6 max-w-2xl leading-relaxed ${isRTL ? "arabic-text mr-0 ml-auto" : ""}`}
        >
          {t("hero.description")}
        </motion.p>

        {/* CTA Buttons - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.23, 1, 0.32, 1] }}
          className={`flex flex-col sm:flex-row gap-3 justify-center items-center ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/courses"
              className="group relative bg-gradient-to-r from-[#C9A84C] to-[#A0803D] hover:from-[#A0803D] hover:to-[#C9A84C] text-[#0D4D2F] px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 shadow-2xl flex items-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <Sparkles className="w-4 h-4" />
              {t("hero.exploreCourses")}
              <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/admission"
              className="group relative bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-[#C9A84C]/50 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {t("hero.applyNow")}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Enhanced */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-white/60 cursor-pointer group"
        >
          <span className="text-[10px] mb-1 group-hover:text-[#C9A84C] transition-colors duration-300">{t("common.scrollDown") || "Scroll Down"}</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/30 group-hover:border-[#C9A84C]/50 flex items-start justify-center pt-1.5 transition-colors duration-300"
          >
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-[#C9A84C]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Decorative Elements */}
      {/* Top Left - Rotating Circle */}
      <motion.div 
        className="absolute top-20 left-10 w-24 h-24"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="absolute inset-0 border border-[#C9A84C]/20 rounded-full animate-rotate-slow" />
        <div className="absolute inset-2 border border-[#C9A84C]/10 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
      </motion.div>

      {/* Bottom Right - Rotating Circle */}
      <motion.div 
        className="absolute bottom-20 right-10 w-32 h-32"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <div className="absolute inset-0 border border-[#C9A84C]/10 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse" }} />
        <div className="absolute inset-4 border border-[#C9A84C]/5 rounded-full animate-rotate-slow" style={{ animationDuration: "25s" }} />
      </motion.div>

      {/* Additional Decorative Elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#C9A84C]/50 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#C9A84C]/30 rounded-full"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </section>
  );
}
