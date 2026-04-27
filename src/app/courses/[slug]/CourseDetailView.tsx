"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, CheckCircle, ChevronRight, GraduationCap, DollarSign, Play } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Course } from "@/types";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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

interface CourseDetailViewProps {
  course: Course;
  relatedCourses: Course[];
}

export default function CourseDetailView({ course, relatedCourses }: CourseDetailViewProps) {
  const { t, isRTL } = useTranslation();

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
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-[var(--background-green)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Link href="/" className="hover:text-[var(--primary)]">{t("common.home") || "Home"}</Link>
              <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              <Link href="/courses" className="hover:text-[var(--primary)]">{t("courses.title") || "Courses"}</Link>
              <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              <span className="text-[var(--text-primary)]">{translatedTitle}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`${levelColors[levelKey]} text-white text-sm font-semibold px-3 py-1 rounded-full`}>
                    {translatedLevel}
                  </span>
                  <span className="bg-[var(--gold)]/20 text-[var(--gold-dark)] text-sm font-semibold px-3 py-1 rounded-full">
                    {translatedCategory}
                  </span>
                </div>

                <h1 className={`text-[var(--text-primary)] text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 ${isRTL ? "arabic-text" : ""}`}>
                  {translatedTitle}
                </h1>

                <p className={`text-[var(--text-secondary)] text-lg mb-6 leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                  {translatedDescription}
                </p>

                <div className={`flex flex-wrap gap-4 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Clock className="w-5 h-5 text-[var(--primary)]" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <DollarSign className="w-5 h-5 text-[var(--primary)]" />
                    <span>${course.feeMin}-${course.feeMax}/{t("common.month")}</span>
                  </div>
                </div>

                <div className={`flex flex-wrap gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Link
                    href={`/admission?course=${course.id}`}
                    className={`inline-flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--primary-dark)] px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {t("courses.enrollNow") || "Enroll Now"}
                    <ChevronRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
                  </Link>
                  <button className={`inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-4 rounded-xl font-semibold transition-all ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Play className="w-5 h-5" />
                    {t("courses.watchPreview") || "Watch Preview"}
                  </button>
                </div>
              </div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={course.image}
                  alt={translatedTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Outcomes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
              >
                <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <GraduationCap className="w-6 h-6 text-[var(--primary)]" />
                  {t("courses.learningOutcomes") || "Learning Outcomes"}
                </h2>
                <ul className="space-y-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <CheckCircle className={`w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 ${isRTL ? "order-2" : ""}`} />
                      <span className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text text-right" : ""}`}>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Core Books */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 md:p-8 border border-[var(--border)]"
              >
                <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <BookOpen className="w-6 h-6 text-[var(--primary)]" />
                  {t("courses.coreBooks") || "Core Books & Materials"}
                </h2>
                <ul className="space-y-3">
                  {course.coreBooks.map((book, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                        <span className="text-[var(--primary)] font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-[var(--text-secondary)]">{book}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Prerequisites & Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-card rounded-2xl p-6 border border-[var(--border)]">
                  <h3 className={`text-[var(--text-primary)] font-bold mb-3 ${isRTL ? "arabic-text" : ""}`}>{t("courses.prerequisites") || "Prerequisites"}</h3>
                  <p className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                    {course.prerequisites === "None" 
                      ? t("courses.noPrerequisites") || "No prior knowledge required. Suitable for beginners."
                      : translatedPrerequisites}
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-[var(--border)]">
                  <h3 className={`text-[var(--text-primary)] font-bold mb-3 ${isRTL ? "arabic-text" : ""}`}>{t("courses.nextCourse") || "Next Recommended Course"}</h3>
                  <p className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>{course.nextCourse}</p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[var(--primary)] rounded-2xl p-6 text-white"
              >
                <h3 className={`text-xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>{t("courses.readyToStart") || "Ready to Start Learning?"}</h3>
                <p className={`text-white/80 mb-6 text-sm ${isRTL ? "arabic-text" : ""}`}>
                  {t("courses.joinStudents") || "Join thousands of students worldwide learning authentic Islamic knowledge."}
                </p>
                <div className="space-y-3">
                  <Link
                    href={`/admission?course=${course.id}`}
                    className="block w-full bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--primary-dark)] text-center py-3 rounded-xl font-bold transition-colors"
                  >
                    {t("courses.enrollNow") || "Enroll Now"}
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 rounded-xl font-semibold transition-colors"
                  >
                    {t("courses.askQuestion") || "Ask a Question"}
                  </Link>
                </div>
              </motion.div>

              {/* Course Info Card */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-[var(--border)]"
              >
                <h3 className={`text-[var(--text-primary)] font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>{t("courses.courseDetails") || "Course Details"}</h3>
                <div className="space-y-3 text-sm">
                  <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-[var(--text-muted)]">{t("courses.category") || "Category"}</span>
                    <span className="text-[var(--text-primary)] font-medium">{translatedCategory}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-[var(--text-muted)]">{t("courses.level") || "Level"}</span>
                    <span className="text-[var(--text-primary)] font-medium">{translatedLevel}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-[var(--text-muted)]">{t("courses.duration") || "Duration"}</span>
                    <span className="text-[var(--text-primary)] font-medium">{course.duration}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-[var(--text-muted)]">{t("courses.schedule") || "Schedule"}</span>
                    <span className="text-[var(--text-primary)] font-medium">{course.schedule.split("·")[0]}</span>
                  </div>
                  <div className="pt-3 border-t border-[var(--border)]">
                    <span className={`text-[var(--text-muted)] ${isRTL ? "block text-right" : ""}`}>{t("courses.monthlyFee") || "Monthly Fee"}</span>
                    <p className={`text-2xl font-bold text-[var(--gold)] mt-1 ${isRTL ? "text-right" : ""}`}>
                      ${course.feeMin}-${course.feeMax}
                    </p>
                    <p className={`text-[var(--text-muted)] text-xs ${isRTL ? "text-right" : ""}`}>{t("courses.usdPerMonth") || "USD per month"}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="py-16 bg-[var(--background-green)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className={`text-[var(--text-primary)] text-2xl font-bold ${isRTL ? "arabic-text" : ""}`}>
                {t("courses.relatedIn") || "Related Courses in"} {translatedCategory}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCourses.map((relatedCourse, index) => (
                <motion.div
                  key={relatedCourse.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/courses/${relatedCourse.slug}`}
                    className="block bg-card rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-lg transition-all group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relatedCourse.image}
                        alt={relatedCourse.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className={`absolute top-3 left-3 ${levelColors[levelKeys[relatedCourse.level] || "beginner"]} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                        {t(`levels.${levelKeys[relatedCourse.level] || "beginner"}`) || relatedCourse.level}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[var(--text-primary)] font-bold mb-1 group-hover:text-[var(--primary)] transition-colors">
                        {relatedCourse.title}
                      </h3>
                      <p className="text-[var(--text-muted)] text-sm">
                        {relatedCourse.duration} · ${relatedCourse.feeMin}-${relatedCourse.feeMax}/mo
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
