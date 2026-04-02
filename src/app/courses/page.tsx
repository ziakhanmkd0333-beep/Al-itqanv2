"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, ChevronRight, Filter, Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useTranslation } from "@/hooks/use-translation";

interface Course {
  id: string;
  title: string;
  slug: string;
  level: string;
  category: string;
  description: string;
  duration: string;
  schedule: string;
  fee_min: number;
  fee_max: number;
  prerequisites: string;
  image_url: string;
  core_books: string;
  next_course: string;
  display_order: number;
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-orange-500",
  specialized: "bg-purple-500"
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

function CourseCard({ course, index, isRTL, t }: { course: Course; index: number; isRTL: boolean; t: (key: string) => string }) {
  const levelKey = levelKeys[course.level] || "beginner";
  const categoryKey = categoryKeys[course.category] || "quran";
  const translatedLevel = t(`levels.${levelKey}`) || course.level;
  const translatedCategory = t(`courseCategories.${categoryKey}`) || course.category;
  
  // Get translation key for this course
  const translationKey = slugToTranslationKey[course.slug];
  const translatedTitle = translationKey ? t(`courseData.${translationKey}.title`) || course.title : course.title;
  const translatedDescription = translationKey ? t(`courseData.${translationKey}.description`) || course.description : course.description;
  const translatedPrerequisites = translationKey ? t(`courseData.${translationKey}.prerequisites`) || course.prerequisites : course.prerequisites;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--border)] flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={course.image_url || `/courses/${course.slug}.png`}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/courses/placeholder.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Level Badge */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
          <span className={`${levelColors[levelKey]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
            {translatedLevel}
          </span>
        </div>

        {/* Category Badge */}
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
          <span className="bg-white/90 text-[var(--primary-dark)] text-xs font-semibold px-3 py-1 rounded-full">
            {translatedCategory}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className={`text-[var(--text-primary)] font-bold text-base mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors ${isRTL ? "arabic-text" : ""}`}>
          {translatedTitle}
        </h3>
        
        <p className={`text-[var(--text-muted)] text-sm mb-3 line-clamp-2 flex-grow ${isRTL ? "arabic-text" : ""}`}>
          {translatedDescription}
        </p>

        {/* Meta Info */}
        <div className={`flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{course.schedule?.split("·")[0]}</span>
          </div>
        </div>

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites !== "None" && (
          <p className={`text-[var(--text-muted)] text-xs mb-3 ${isRTL ? "arabic-text" : ""}`}>
            <span className="font-medium">{t("courses.pre") || "Pre"}:</span> {translatedPrerequisites}
          </p>
        )}

        {/* Fee */}
        <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="text-[var(--primary)] font-bold text-sm">
            ${course.fee_min}-${course.fee_max}
            <span className="text-[var(--text-muted)] text-xs font-normal">/{t("common.month")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={`grid grid-cols-2 gap-2 w-full ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center justify-center gap-1 bg-[var(--primary-soft)] hover:bg-[var(--primary)] text-[var(--primary-dark)] hover:text-white py-2.5 rounded-lg font-semibold text-xs transition-all duration-300 group/btn"
          >
            {t("courses.details") || "Details"}
          </Link>
          <Link
            href={`/admission?course=${course.id}`}
            className="flex items-center justify-center gap-1 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--primary-dark)] py-2.5 rounded-lg font-semibold text-xs transition-all duration-300 group/btn"
          >
            {t("courses.enroll") || "Enroll"}
            <ChevronRight className={`w-3 h-3 transition-transform ${isRTL ? "group-hover/btn:-translate-x-1 rotate-180" : "group-hover/btn:translate-x-1"}`} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export default function CoursesPage() {
  const { t, isRTL } = useTranslation();
  
  // Generate particles client-side only to avoid hydration mismatch
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
  
  // Move categories inside component to use translations
  const categories = [
    { id: "all", label: t("categories.all") || "All Courses" },
    { id: "Quran", label: t("categories.quran") || "Quran" },
    { id: "Arabic Language", label: t("categories.arabic") || "Arabic" },
    { id: "Fiqh", label: t("categories.fiqh") || "Fiqh" },
    { id: "Sarf & Nahw", label: t("categories.sarfNahw") || "Sarf & Nahw" },
    { id: "Hadith", label: t("categories.hadith") || "Hadith" }
  ];
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedLevel) params.append("level", selectedLevel);

      console.log('Fetching courses...');
      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();
      
      console.log('API response:', data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch courses");
      }
      
      if (!data.courses || !Array.isArray(data.courses)) {
        console.error('Invalid courses data:', data);
        throw new Error("Invalid data format from API");
      }
      
      setCourses(data.courses);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 min-h-[45vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/courses-hero.png"
            alt={t("courses.allCourses") || "All Courses"}
            fill
            className="object-cover"
            priority
          />
          
          {/* Gradient Overlay */}
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
                <pattern id="courses-hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
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
              <rect width="100%" height="100%" fill="url(#courses-hero-pattern)" />
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
              className="inline-block mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <p className="arabic-text text-[#C9A84C] text-xl md:text-2xl lg:text-3xl leading-relaxed relative">
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
                {t("courses.ourPrograms") || "Our Programs"}
              </span>
            </motion.div>

            {/* Main Title with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 ${isRTL ? "arabic-text" : ""}`}
              style={{
                textShadow: "0 4px 30px rgba(0,0,0,0.5)"
              }}
            >
              <span className="bg-gradient-to-r from-white via-white to-[#C9A84C] bg-clip-text text-transparent">
                {loading ? (t("courses.allCourses") || "All Courses") : `All ${courses.length} Courses`}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isRTL ? "arabic-text" : ""}`}
            >
              {t("courses.description") || "Complete Islamic curriculum from beginner to specialization level"}
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

      {/* Filters */}
      <section className="py-8 bg-[var(--background-green)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-wrap items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
              <span className="text-[var(--text-secondary)] font-medium">{t("common.filter") || "Filter"}</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-[var(--primary)] text-white"
                      : "bg-card text-[var(--text-secondary)] hover:bg-[var(--primary)]/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 rounded-full bg-card border border-[var(--border)] text-[var(--text-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">{t("courses.allLevels") || "All Levels"}</option>
              <option value="Beginner">{t("courses.beginner") || "Beginner"}</option>
              <option value="Intermediate">{t("courses.intermediate") || "Intermediate"}</option>
              <option value="Advanced">{t("courses.advanced") || "Advanced"}</option>
              <option value="Specialized">{t("courses.specialized") || "Specialized"}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-[var(--text-muted)]">
              {t("courses.noCourses") || "No courses found"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} isRTL={isRTL} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Progression Path Info */}
      <section className="py-16 bg-[var(--background-green)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className={`text-[var(--text-primary)] text-3xl font-bold font-display mb-4 ${isRTL ? "arabic-text" : ""}`}>
              {t("courses.learningPaths") || "Learning Progression Paths"}
            </h2>
            <p className={`text-[var(--text-secondary)] max-w-2xl mx-auto ${isRTL ? "arabic-text" : ""}`}>
              {t("courses.learningPathsDesc") || "Follow our structured curriculum designed to take you from foundational knowledge to scholarly specialization"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { 
                discipline: t("disciplines.quran") || "Quran", 
                path: t("paths.quran") || "Noorani Qaida → Nazra → Tajweed → Hifz → Tafseer",
                courses: 7,
                color: "#1A7A4A"
              },
              { 
                discipline: t("disciplines.arabic") || "Arabic", 
                path: t("paths.arabic") || "Beginner → Intermediate → Advanced Spoken → Balaghat",
                courses: 4,
                color: "#27A862"
              },
              { 
                discipline: t("disciplines.fiqh") || "Fiqh", 
                path: t("paths.fiqh") || "Basic (Qudoori) → Int. (Kanz) → Adv. (Hidaya)",
                courses: 6,
                color: "#C9A84C"
              },
              { 
                discipline: t("disciplines.sarfNahw") || "Sarf & Nahw", 
                path: t("paths.sarfNahw") || "Irshad-us-Sarf → Ilm-us-Sigha → Sharah al-Jami",
                courses: 3,
                color: "#4A6B58"
              },
              { 
                discipline: t("disciplines.hadith") || "Hadith", 
                path: t("paths.hadith") || "Riyadh-us-Saliheen → Mishkat → Bukhari → Takhassus",
                courses: 4,
                color: "#0D4D2F"
              }
            ].map((item, index) => (
              <motion.div
                key={item.discipline}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-[var(--border)]"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <span 
                    className="text-xl font-bold"
                    style={{ color: item.color }}
                  >
                    {item.courses}
                  </span>
                </div>
                <h3 className={`text-[var(--text-primary)] font-bold text-lg mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {item.discipline}
                </h3>
                <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>
                  {item.path}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
