"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, Megaphone, Calendar, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function HeroSection() {
  const { t, isRTL } = useTranslation();

  return (
    <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden py-6 md:py-10">
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

      {/* Content - 2 Column Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isRTL ? "text-right" : "text-left"}`} suppressHydrationWarning>
          
          {/* Left Column - Existing Content */}
          <div className={`space-y-4 md:space-y-5 ${isRTL ? "lg:order-1" : "lg:order-1"}`} suppressHydrationWarning>
            {/* Bismillah */}
            <div className="mb-3">
              <p className="arabic-text text-[#C9A84C] text-xl md:text-2xl lg:text-3xl leading-relaxed">
                {t("hero.bismillah")}
              </p>
            </div>

            {/* Main Headline */}
            <h1 className={`font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight max-w-2xl ${isRTL ? "arabic-text" : ""}`} suppressHydrationWarning>
              <span className="bg-gradient-to-r from-white via-white to-[#C9A84C] bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className={`text-lg md:text-xl lg:text-2xl text-white/95 font-bold max-w-2xl ${isRTL ? "arabic-text" : ""}`} suppressHydrationWarning>
              {t("hero.subtitle")}
            </h2>

            {/* Description */}
            <p className={`text-base md:text-lg text-white/90 max-w-2xl leading-relaxed ${isRTL ? "arabic-text" : ""}`} suppressHydrationWarning>
              {t("hero.description")}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 pt-2 ${isRTL ? "items-end" : "items-start"}`} suppressHydrationWarning>
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

          {/* Right Column - Modern Blob Notification */}
          <div className={`${isRTL ? "lg:order-2" : "lg:order-2"} flex justify-center ${isRTL ? "lg:justify-end" : "lg:justify-end"}`} suppressHydrationWarning>
            <NotificationBlob />
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(201, 168, 76, 0.2), 0 0 40px rgba(201, 168, 76, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(201, 168, 76, 0.35), 0 0 60px rgba(201, 168, 76, 0.2);
          }
        }
        
        @keyframes fadeScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glowPulse 4s ease-in-out infinite;
        }
        
        .animate-fade-scale-in {
          animation: fadeScaleIn 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

// Modern Blob Notification Component
function NotificationBlob() {
  const { t, isRTL } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative animate-fade-scale-in"
    >
      {/* Main Blob Card */}
      <div 
        className="
          relative
          w-[320px] sm:w-[360px] md:w-[400px]
          min-h-[420px] sm:min-h-[450px]
          p-6 sm:p-8
          rounded-[40px] sm:rounded-[50%]
          bg-gradient-to-br from-emerald-50/95 via-white/90 to-emerald-100/95
          backdrop-blur-xl
          border border-emerald-200/50
          shadow-[0_20px_60px_-15px_rgba(13,77,47,0.25)]
          animate-float animate-glow-pulse
          hover:scale-[1.03] hover:shadow-[0_30px_80px_-15px_rgba(13,77,47,0.35)]
          transition-all duration-300 ease-out
          flex flex-col items-center text-center
          overflow-hidden
        "
      >
        {/* Decorative Background Elements */}
        <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-gradient-to-br from-[#C9A84C]/20 to-transparent rounded-full blur-2xl`} />
        <div className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-24 h-24 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full blur-xl`} />
        
        {/* Limited Seats Badge */}
        <div className={`absolute -top-1 ${isRTL ? '-left-1 sm:top-2 sm:left-2' : '-right-1 sm:top-2 sm:right-2'} z-10`} suppressHydrationWarning>
          <div className="
            flex items-center gap-1.5
            px-3 py-1.5
            bg-gradient-to-r from-red-500 to-red-600
            text-white text-xs font-bold
            rounded-full
            shadow-lg shadow-red-500/30
            animate-pulse
          ">
            <AlertCircle className="w-3.5 h-3.5" />
            <span suppressHydrationWarning>{t("notification.limitedSeats")}</span>
          </div>
        </div>

        {/* Header Icon */}
        <div className="
          relative z-10
          w-16 h-16 sm:w-20 sm:h-20
          mb-4
          flex items-center justify-center
          rounded-full
          bg-gradient-to-br from-emerald-500 to-emerald-700
          shadow-lg shadow-emerald-500/30
        ">
          <Megaphone className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        {/* Title */}
        <h3 className="
          relative z-10
          arabic-text
          text-2xl sm:text-3xl
          font-bold
          text-emerald-900
          mb-4
          leading-tight
        "
        suppressHydrationWarning>
          📢 {t("notification.title")}
        </h3>

        {/* Content */}
        <div className="relative z-10 space-y-3 text-emerald-800">
          <p className="arabic-text text-base sm:text-lg leading-relaxed font-medium" suppressHydrationWarning>
            {t("notification.line1")}{" "}
            <span className="text-[#C9A84C] font-bold">{t("notification.highlight")}</span>{" "}
            {t("notification.line1End")}
          </p>
          
          <p className="arabic-text text-sm sm:text-base leading-relaxed text-emerald-700/90" suppressHydrationWarning>
            {t("notification.line2")}
          </p>
          
          <p className="arabic-text text-sm sm:text-base leading-relaxed text-emerald-600/80" suppressHydrationWarning>
            {t("notification.line3")}
          </p>
        </div>

        {/* Date Section */}
        <div className="
          relative z-10
          mt-5
          p-3 sm:p-4
          w-full
          bg-gradient-to-r from-emerald-100/80 to-[#C9A84C]/10
          rounded-2xl
          border border-emerald-200/50
        "
        suppressHydrationWarning>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="arabic-text text-sm font-semibold text-emerald-700" suppressHydrationWarning>
              {t("notification.classStart")}
            </span>
          </div>
          <p className="arabic-text text-base sm:text-lg font-bold text-emerald-900 text-center" suppressHydrationWarning>
            {t("notification.hijriDate")}
          </p>
          <p className="arabic-text text-xs sm:text-sm text-emerald-600 text-center mt-1" suppressHydrationWarning>
            {t("notification.gregorianDate")}
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/admission"
          className="
            relative z-10
            mt-5
            w-full
            py-3 px-6
            bg-gradient-to-r from-emerald-600 to-[#C9A84C]
            hover:from-emerald-700 hover:to-[#B8983D]
            text-white
            arabic-text
            text-sm sm:text-base
            font-bold
            rounded-full
            shadow-lg shadow-emerald-500/30
            hover:shadow-xl hover:shadow-emerald-500/40
            hover:scale-105
            transition-all duration-300
            flex items-center justify-center gap-2
            group
          "
          suppressHydrationWarning>
          <span suppressHydrationWarning>🔘 {t("notification.cta")}</span>
          <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`} />
        </Link>
      </div>
    </motion.div>
  );
}
