"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function HeroSection() {
  const { t, isRTL } = useTranslation();

  return (
    <section className="relative min-h-[40vh] md:min-h-[45vh] flex items-center justify-center overflow-hidden py-6 md:py-8">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/about-hero.png"
        >
          <source src="/images/01.mp4" type="video/mp4" />
        </video>
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(13, 77, 47, 0.85) 0%, rgba(26, 122, 74, 0.80) 30%, rgba(13, 77, 47, 0.85) 100%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-6 pb-8 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Bismillah */}
        <div className="mb-3 text-center">
          <p className="arabic-text text-[#C9A84C] text-xl md:text-2xl lg:text-3xl leading-relaxed">
            {t("hero.bismillah")}
          </p>
        </div>

        {/* Main Headline */}
        <h1 className={`font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-3 md:mb-4 leading-tight max-w-2xl ${isRTL ? "arabic-text ml-auto" : ""}`}>
          <span className="bg-gradient-to-r from-white via-white to-[#C9A84C] bg-clip-text text-transparent">
            {t("hero.title")}
          </span>
        </h1>

        {/* Subheadline */}
        <h2 className={`text-lg md:text-xl lg:text-2xl text-white/95 mb-3 md:mb-4 font-bold max-w-2xl ${isRTL ? "arabic-text ml-auto" : ""}`}>
          {t("hero.subtitle")}
        </h2>

        {/* Description */}
        <p className={`text-base md:text-lg text-white/90 mb-5 md:mb-6 max-w-2xl leading-relaxed ${isRTL ? "arabic-text ml-auto" : ""}`}>
          {t("hero.description")}
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? "items-end" : "items-start"}`}>
          <Link
            href="/courses"
            className="group bg-gradient-to-r from-[#C9A84C] to-[#A0803D] hover:from-[#A0803D] hover:to-[#C9A84C] text-[#0D4D2F] px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {t("hero.exploreCourses")}
            <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`} />
          </Link>

          <Link
            href="/admission"
            className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-[#C9A84C]/50 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {t("hero.applyNow")}
          </Link>
        </div>
      </div>
    </section>
  );
}
