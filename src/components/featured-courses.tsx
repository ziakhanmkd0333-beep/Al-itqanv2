"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, ChevronRight, Sparkles, GraduationCap } from "lucide-react";
import { getFeaturedCourses } from "@/lib/courses-data";
import { Course } from "@/types";
import { useTranslation } from "@/hooks/use-translation";

const levelColors: Record<string, string> = {
  beginner: "from-green-500 to-emerald-600",
  intermediate: "from-yellow-500 to-amber-600",
  advanced: "from-orange-500 to-red-600",
  specialized: "from-purple-500 to-violet-600"
};

const levelBgColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  advanced: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  specialized: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
};

const levelKeys: Record<string, string> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Specialized: "specialized"
};

const categoryKeys: Record<string, string> = {
  Quran: "quran",
  "Arabic Language": "arabic",
  Fiqh: "fiqh",
  "Sarf & Nahw": "sarfNahw",
  Hadith: "hadith"
};

// Map course slugs to translation keys
const slugToTranslationKey: Record<string, string> = {
  "noorani-qaida": "nooraniQaida",
  "nazra-quran": "nazraQuran",
  "quran-with-tajweed": "quranTajweed",
  "advanced-tajweed": "advancedTajweed",
  "hifz-ul-quran": "hifzQuran",
  "tarjumat-ul-quran": "tarjumatQuran",
  "advanced-tafseer": "advancedTafseer",
  "beginner-arabic": "beginnerArabic",
  "intermediate-arabic": "intermediateArabic",
  "advanced-spoken-arabic": "advancedSpokenArabic",
  "advanced-balaghat": "advancedBalaghat",
  "basic-fiqh": "basicFiqh",
  "intermediate-fiqh": "intermediateFiqh",
  "advanced-fiqh": "advancedFiqh",
  "basic-usool-fiqh": "basicUsoolFiqh",
  "intermediate-usool-fiqh": "intermediateUsoolFiqh",
  "advanced-usool-fiqh": "advancedUsoolFiqh",
  "basic-sarf-nahw": "basicSarfNahw",
  "intermediate-sarf-nahw": "intermediateSarfNahw",
  "advanced-sarf-nahw": "advancedSarfNahw",
  "basic-hadith": "basicHadith",
  "intermediate-hadith": "intermediateHadith",
  "advanced-hadith": "advancedHadith",
  "takhassus-fil-hadith": "takhassusHadith"
};

function CourseCard({ course, index }: { course: Course; index: number }) {
  const { t, isRTL } = useTranslation();
  
  const levelKey = levelKeys[course.level] || "beginner";
  const categoryKey = categoryKeys[course.category] || "quran";
  const translatedLevel = t(`levels.${levelKey}`) || course.level;
  const translatedCategory = t(`courseCategories.${categoryKey}`) || course.category;
  
  // Get translation key for this course
  const translationKey = slugToTranslationKey[course.slug];
  const translatedTitle = translationKey ? t(`courseData.${translationKey}.title`) || course.title : course.title;
  const translatedDescription = translationKey ? t(`courseData.${translationKey}.description`) || course.description : course.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--gold)]/20 via-[var(--primary)]/20 to-[var(--gold)]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Card */}
      <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[var(--border)] hover:border-[var(--gold)]/50">
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={course.image}
            alt={translatedTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Animated Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Level Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 + 0.3 }}
            className="absolute top-4 left-4"
          >
            <span className={`bg-gradient-to-r ${levelColors[levelKey]} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5`}>
              <Sparkles className="w-3 h-3" />
              {translatedLevel}
            </span>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 + 0.3 }}
            className="absolute top-4 right-4"
          >
            <span className="bg-white/95 backdrop-blur-sm text-[var(--primary-dark)] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3" />
              {translatedCategory}
            </span>
          </motion.div>

          {/* Course Code Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-black/50 backdrop-blur-sm text-white/90 text-xs font-mono px-3 py-1 rounded-lg">
              {course.code}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative">
          {/* Decorative Line */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

          <h3 className="text-[var(--text-primary)] font-bold text-lg mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-300">
            {translatedTitle}
          </h3>

          <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2 leading-relaxed">
            {translatedDescription}
          </p>

          {/* Meta Info with Icons */}
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
            <div className="flex items-center gap-1.5 bg-[var(--background)] px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-[var(--gold)]" />
              <span className="font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--background)] px-3 py-1.5 rounded-lg">
              <BookOpen className="w-4 h-4 text-[var(--primary)]" />
              <span className="font-medium">{course.schedule.split("·")[0]}</span>
            </div>
          </div>

          {/* Fee with Highlight */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-baseline gap-1">
              <span className="text-[var(--gold)] font-bold text-2xl">${course.feeMin}</span>
              <span className="text-[var(--text-muted)]">-</span>
              <span className="text-[var(--text-muted)] font-semibold">${course.feeMax}</span>
              <span className="text-[var(--text-muted)] text-xs ml-1">/{t("courses.month") || "month"}</span>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <Link
            href={`/courses/${course.slug}`}
            className={`group/btn flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:from-[var(--gold)] hover:to-[var(--gold-dark)] text-white py-3.5 rounded-xl font-semibold transition-all duration-500 shadow-lg hover:shadow-xl ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className="relative">
              {t("courses.viewDetails") || "View Details"}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 group-hover/btn:w-full transition-all duration-300" />
            </span>
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"}`} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedCourses() {
  const { t, isRTL } = useTranslation();
  const featuredCourses = getFeaturedCourses();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[var(--background-green)]">
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--primary)]/10 border border-[var(--gold)]/20 rounded-full px-5 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-[var(--gold)] text-sm font-semibold uppercase tracking-wider">
              {t("courses.ourPrograms") || "Our Programs"}
            </span>
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          </motion.div>

          <h2 className={`text-[var(--text-primary)] text-4xl md:text-5xl lg:text-6xl font-bold font-display mt-4 mb-6 leading-tight ${isRTL ? "arabic-text" : ""}`}>
            {t("courses.subtitle") || "Complete 24-Course Islamic Curriculum"}
          </h2>

          <p className={`text-[var(--text-secondary)] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
            {t("courses.description") || "Structured learning paths from foundational to advanced specialization levels across 5 disciplines"}
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <div className="w-2 h-2 rounded-full bg-[var(--gold)]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>
        </motion.div>

        {/* Featured Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/courses"
            className={`group inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:from-[var(--gold-dark)] hover:to-[var(--gold)] text-[var(--primary-dark)] px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span>{t("courses.viewAll") || "Explore All Courses"}</span>
            <div className="w-10 h-10 rounded-full bg-[var(--primary-dark)]/10 flex items-center justify-center group-hover:bg-[var(--primary-dark)] group-hover:text-white transition-all duration-300">
              <ChevronRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
