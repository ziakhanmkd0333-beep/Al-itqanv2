"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Filter,
  Upload,
  FileText,
  GraduationCap,
  Layers,
  Calendar
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

// Types
interface Course {
  id: string;
  title: string;
  title_ar?: string;
  title_ur?: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Specialized";
  category: "Quran" | "Arabic Language" | "Fiqh" | "Sarf & Nahw" | "Hadith";
  description: string;
  description_ar?: string;
  description_ur?: string;
  fee_min: number;
  fee_max: number;
  duration: string;
  schedule: string;
  prerequisites: string[] | string;
  core_books: string[] | string;
  next_course: string;
  status: "published" | "draft" | "archived";
  teacher_id: string;
  teacher_name?: string;
  image_url?: string;
  students_count: number;
  created_at: string;
}

interface CourseFormData {
  title: string;
  title_ar: string;
  title_ur: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Specialized";
  category: "Quran" | "Arabic Language" | "Fiqh" | "Sarf & Nahw" | "Hadith";
  description: string;
  description_ar: string;
  description_ur: string;
  fee_min: number;
  fee_max: number;
  duration: string;
  schedule: string;
  prerequisites: string[];
  core_books: string[];
  next_course: string;
  status: "published" | "draft" | "archived";
  teacher_id: string;
}

const initialFormData: CourseFormData = {
  title: "",
  title_ar: "",
  title_ur: "",
  level: "Beginner",
  category: "Quran",
  description: "",
  description_ar: "",
  description_ur: "",
  fee_min: 20,
  fee_max: 30,
  duration: "",
  schedule: "",
  prerequisites: [],
  core_books: [],
  next_course: "",
  status: "draft",
  teacher_id: ""
};

const categories = ["Quran", "Arabic Language", "Fiqh", "Sarf & Nahw", "Hadith"];
const levels = ["Beginner", "Intermediate", "Advanced", "Specialized"];
const statuses = [
  { value: "published", label: "Published", color: "green" },
  { value: "draft", label: "Draft", color: "yellow" },
  { value: "archived", label: "Archived", color: "gray" }
];

// All 24 courses from PRD
const allCourses: Course[] = [
  // Quran Courses (7)
  {
    id: "1",
    title: "Noorani Qaida",
    title_ar: "القاعدة النورانية",
    title_ur: "نورانی قاعدہ",
    level: "Beginner",
    category: "Quran",
    description: "A beginner-level course designed for students who want to start learning how to read the Holy Quran correctly. Focuses on basic Arabic alphabet, correct pronunciation (Makharij), joining letters, and simple reading rules.",
    fee_min: 20,
    fee_max: 30,
    duration: "2–3 Months",
    schedule: "3–5 days/week · 30 min (children) / 45 min (adults)",
    prerequisites: [],
    core_books: ["Noorani Qaida"],
    next_course: "Nazra Quran",
    status: "published",
    teacher_id: "2",
    teacher_name: "Sheikh Ahmad Al-Qari",
    students_count: 85,
    created_at: "2024-01-15"
  },
  {
    id: "2",
    title: "Nazra Quran",
    title_ar: "نظرة القرآن",
    title_ur: "نظرہ قرآن",
    level: "Beginner",
    category: "Quran",
    description: "Designed for students who know basic Arabic letters and want to read the Holy Quran fluently and correctly. Focuses on reading speed, accuracy, and confidence while applying basic Tajweed rules.",
    fee_min: 25,
    fee_max: 35,
    duration: "3–4 Months",
    schedule: "3–5 days/week · 30 min (children) / 45 min (adults)",
    prerequisites: ["Noorani Qaida"],
    core_books: ["Holy Quran"],
    next_course: "Quran with Tajweed",
    status: "published",
    teacher_id: "2",
    teacher_name: "Sheikh Ahmad Al-Qari",
    students_count: 72,
    created_at: "2024-01-15"
  },
  {
    id: "3",
    title: "Quran with Tajweed",
    title_ar: "القرآن مع التجويد",
    title_ur: "قرآن تجوید کے ساتھ",
    level: "Intermediate",
    category: "Quran",
    description: "Advanced Quran recitation course for students who can read the Quran but want to perfect recitation by mastering complete Tajweed rules — Makharij, Sifaat, Ikhfa, Idgham, Iqlab, Qalqalah, Madd rules, and Waqf/Ibtida.",
    fee_min: 30,
    fee_max: 40,
    duration: "4–6 Months",
    schedule: "3–5 days/week · 30 min (children) / 45 min (adults)",
    prerequisites: ["Nazra Quran"],
    core_books: ["Holy Quran", "Tajweed Guide"],
    next_course: "Advanced Tajweed Program",
    status: "published",
    teacher_id: "2",
    teacher_name: "Sheikh Ahmad Al-Qari",
    students_count: 65,
    created_at: "2024-02-20"
  },
  {
    id: "4",
    title: "Advanced Tajweed Program",
    title_ar: "برنامج التجويد المتقدم",
    title_ur: "تجوید کا اعلیٰ پروگرام",
    level: "Advanced",
    category: "Quran",
    description: "Complete one-year advanced Tajweed training program covering both theoretical and practical Tajweed. Topics include Makharij, Sifaat, Noon Saakinah/Meem Saakinah rules, and advanced recitation techniques.",
    fee_min: 35,
    fee_max: 50,
    duration: "1 Year",
    schedule: "3–5 days/week · 30–45 min per session",
    prerequisites: ["Quran with Tajweed"],
    core_books: ["Jamal ul-Quran", "Khulasat ut-Tajweed", "Fawaid Makkiyah", "Al-Jazariyyah"],
    next_course: "Hifz-ul-Quran",
    status: "published",
    teacher_id: "2",
    teacher_name: "Sheikh Ahmad Al-Qari",
    students_count: 28,
    created_at: "2024-03-10"
  },
  {
    id: "5",
    title: "Hifz-ul-Quran",
    title_ar: "حفظ القرآن",
    title_ur: "حفظ القرآن",
    level: "Specialized",
    category: "Quran",
    description: "Specialized memorization course for students wishing to memorize the Holy Quran completely or partially under qualified Huffaz supervision. Focuses on systematic memorization, daily revision (Muraja'ah), and correct recitation with Tajweed.",
    fee_min: 40,
    fee_max: 60,
    duration: "2.5–3 Years",
    schedule: "5 days/week · 45–60 min per session",
    prerequisites: ["Quran with Tajweed"],
    core_books: ["Holy Quran"],
    next_course: "Tarjamat-ul-Quran",
    status: "published",
    teacher_id: "2",
    teacher_name: "Sheikh Ahmad Al-Qari",
    students_count: 45,
    created_at: "2024-04-05"
  },
  {
    id: "6",
    title: "Tarjamat-ul-Quran",
    title_ar: "ترجمة القرآن",
    title_ur: "ترجمۃ القرآن",
    level: "Intermediate",
    category: "Quran",
    description: "Comprehensive program for students wanting to understand the meanings and translation of the Holy Quran. Focuses on Quranic verse interpretation, translation (Tafsir in simple language), key themes, moral guidance, rules, and lessons.",
    fee_min: 30,
    fee_max: 45,
    duration: "1 Year",
    schedule: "3–5 days/week · 45–60 min per session",
    prerequisites: ["Nazra Quran"],
    core_books: ["Holy Quran with Translation"],
    next_course: "Advanced Tafseer-ul-Quran",
    status: "published",
    teacher_id: "1",
    teacher_name: "Dr. Noor Ur Rahman Hazarvi",
    students_count: 38,
    created_at: "2024-05-15"
  },
  {
    id: "7",
    title: "Advanced Tafseer-ul-Quran",
    title_ar: "التفسير المتقدم للقرآن",
    title_ur: "تفسیر القرآن کا اعلیٰ کورس",
    level: "Advanced",
    category: "Quran",
    description: "Specialized two-year program for deep understanding of the Holy Quran — meanings, context, and rulings. Goes beyond basic translation to comprehensive analysis including linguistic, grammatical, jurisprudential, and historical contexts.",
    fee_min: 40,
    fee_max: 60,
    duration: "2 Years",
    schedule: "3–5 days/week · 45–60 min per session",
    prerequisites: ["Tarjamat-ul-Quran"],
    core_books: ["Tafseer Ibn Kathir", "Tafseer Al-Jalalayn", "Tafseer Al-Tabari"],
    next_course: "",
    status: "published",
    teacher_id: "1",
    teacher_name: "Dr. Noor Ur Rahman Hazarvi",
    students_count: 22,
    created_at: "2024-06-01"
  },
  // Arabic Language Courses (4)
  {
    id: "8",
    title: "Beginner Arabic",
    title_ar: "العربية للمبتدئين",
    title_ur: "ابتدائی عربی",
    level: "Beginner",
    category: "Arabic Language",
    description: "Designed for students with no prior Arabic knowledge. Builds a strong foundation in Arabic reading, writing, and comprehension covering the Arabic alphabet, pronunciation, basic vocabulary, and simple sentence structure.",
    fee_min: 20,
    fee_max: 30,
    duration: "3 Months",
    schedule: "3–5 days/week · 30–45 min per session",
    prerequisites: [],
    core_books: ["Al-Arabiyyah Bayna Yadayk", "Arabic for Beginners"],
    next_course: "Intermediate Arabic",
    status: "published",
    teacher_id: "4",
    teacher_name: "Ustadh Yusuf Al-Arabi",
    students_count: 55,
    created_at: "2024-01-20"
  },
  {
    id: "9",
    title: "Intermediate Arabic",
    title_ar: "العربية المتوسطة",
    title_ur: "وسطانی عربی",
    level: "Intermediate",
    category: "Arabic Language",
    description: "Builds on beginner foundations with intermediate grammar (nouns, verbs, tenses, gender, sentence structure), expanded vocabulary, reading short paragraphs, writing simple sentences, and basic conversational skills.",
    fee_min: 25,
    fee_max: 40,
    duration: "6 Months",
    schedule: "3–5 days/week · 45–60 min per session",
    prerequisites: ["Beginner Arabic"],
    core_books: ["Al-Kitaab fii Ta'allum al-'Arabiyya (Parts 1 & 2)", "Arabic Grammar Made Easy"],
    next_course: "Advanced Spoken Arabic",
    status: "published",
    teacher_id: "4",
    teacher_name: "Ustadh Yusuf Al-Arabi",
    students_count: 42,
    created_at: "2024-02-25"
  },
  {
    id: "10",
    title: "Advanced Spoken Arabic",
    title_ar: "العربية المحكية المتقدمة",
    title_ur: "اعلیٰ گفتاری عربی",
    level: "Advanced",
    category: "Arabic Language",
    description: "For students who have completed Intermediate level and want to achieve fluency in Arabic speaking, reading, writing, and comprehension. Covers advanced grammar, complex sentence structures, and fluent conversation.",
    fee_min: 35,
    fee_max: 50,
    duration: "1 Year",
    schedule: "3–5 days/week · 45–60 min per session",
    prerequisites: ["Intermediate Arabic"],
    core_books: ["Al-Mawrid Dictionary", "Fus'ha Arabic for Advanced Learners", "Arabic Conversation Made Easy"],
    next_course: "Advanced Ilm-e-Balaghat",
    status: "published",
    teacher_id: "4",
    teacher_name: "Ustadh Yusuf Al-Arabi",
    students_count: 35,
    created_at: "2024-03-15"
  },
  {
    id: "11",
    title: "Advanced Ilm-e-Balaghat",
    title_ar: "علم البلاغة المتقدم",
    title_ur: "علم بلاغت کا اعلیٰ کورس",
    level: "Advanced",
    category: "Arabic Language",
    description: "Designed for students wanting to master Arabic eloquence (Balagha), the art of rhetoric, literary analysis, and stylistic excellence. Covers Ilm al-Ma'ani, Ilm al-Bayan, and Ilm al-Badi'.",
    fee_min: 40,
    fee_max: 60,
    duration: "1 Year",
    schedule: "3–5 days/week · 45–60 min per session",
    prerequisites: ["Advanced Spoken Arabic"],
    core_books: ["Balaghat-ul-Quran", "Al-Balagha al-Wadihah", "Al-Bayan wa al-Tabyin"],
    next_course: "",
    status: "published",
    teacher_id: "4",
    teacher_name: "Ustadh Yusuf Al-Arabi",
    students_count: 18,
    created_at: "2024-04-10"
  },
  // Fiqh Courses (6)
  {
    id: "12",
    title: "Basic Fiqh (Qudoori)",
    title_ar: "الفقه الأساسي (القدوري)",
    title_ur: "فقه قدوری",
    level: "Beginner",
    category: "Fiqh",
    description: "Introduces fundamentals of Islamic jurisprudence in a simple, accessible manner. Covers acts of worship (Ibadat) — Salah, Sawm, Zakat, Hajj — and personal/social conduct (Mu'amalat).",
    fee_min: 20,
    fee_max: 30,
    duration: "2–3 Months",
    schedule: "3–5 days/week · 45 min per session",
    prerequisites: [],
    core_books: ["Mukhtasar al-Qudoori"],
    next_course: "Intermediate Fiqh (Kanz)",
    status: "published",
    teacher_id: "3",
    teacher_name: "Mufti Abdullah Khan",
    students_count: 48,
    created_at: "2024-01-25"
  },
  {
    id: "13",
    title: "Intermediate Fiqh (Kanz)",
    title_ar: "الفقه المتوسط (الكنز)",
    title_ur: "فقه کنز الدقائق",
    level: "Intermediate",
    category: "Fiqh",
    description: "Builds on basic Fiqh with more detailed rulings and practical applications. Advanced worship topics include missed/combined prayers, special fasting cases, detailed zakat calculation, and Hajj/Umrah rituals.",
    fee_min: 25,
    fee_max: 35,
    duration: "6 Months",
    schedule: "3–4 days/week · 60 min per session",
    prerequisites: ["Basic Fiqh (Qudoori)"],
    core_books: ["Kanz ud-Daqaiq"],
    next_course: "Advanced Fiqh (Hidaya)",
    status: "published",
    teacher_id: "3",
    teacher_name: "Mufti Abdullah Khan",
    students_count: 32,
    created_at: "2024-02-28"
  },
  {
    id: "14",
    title: "Advanced Fiqh (Hidaya)",
    title_ar: "الفقه المتقدم (الهداية)",
    title_ur: "فقد ہدایہ",
    level: "Advanced",
    category: "Fiqh",
    description: "Designed for students seeking mastery in Islamic jurisprudence. Using the classical text Al-Hidaya, students explore in-depth rulings for all acts of worship, complex social dealings, inheritance, criminal laws.",
    fee_min: 35,
    fee_max: 50,
    duration: "12 Months",
    schedule: "3–4 days/week · 60–90 min per session",
    prerequisites: ["Intermediate Fiqh (Kanz)"],
    core_books: ["Al-Hidaya (Imam al-Marghinani)"],
    next_course: "",
    status: "published",
    teacher_id: "3",
    teacher_name: "Mufti Abdullah Khan",
    students_count: 25,
    created_at: "2024-03-20"
  },
  {
    id: "15",
    title: "Basic Usool Fiqh (Shashi)",
    title_ar: "أصول الفقه الأساسي (الشاشي)",
    title_ur: "اصول فقه شاشی",
    level: "Beginner",
    category: "Fiqh",
    description: "Designed for students new to the principles of Islamic jurisprudence. Using Usool Shashi, students learn foundational rules and terminology for deriving Islamic rulings from the Quran and Sunnah.",
    fee_min: 20,
    fee_max: 30,
    duration: "3 Months",
    schedule: "3–5 days/week · 45 min per session",
    prerequisites: [],
    core_books: ["Usool Shashi"],
    next_course: "Intermediate Usool Fiqh",
    status: "published",
    teacher_id: "3",
    teacher_name: "Mufti Abdullah Khan",
    students_count: 38,
    created_at: "2024-04-05"
  },
  {
    id: "16",
    title: "Intermediate Usool Fiqh",
    title_ar: "أصول الفقه المتوسط",
    title_ur: "وسطانی اصول فقه",
    level: "Intermediate",
    category: "Fiqh",
    description: "Builds on Shashi foundations using Noor-ul-Anwar to guide students through intermediate principles of Islamic jurisprudence — Ijtihad, Qiyas, Ijma, definitive vs. speculative texts.",
    fee_min: 25,
    fee_max: 35,
    duration: "6 Months",
    schedule: "3–4 days/week · 60 min per session",
    prerequisites: ["Basic Usool Fiqh (Shashi)"],
    core_books: ["Noor-ul-Anwar (up to Qiyas)"],
    next_course: "Advanced Usool Fiqh",
    status: "published",
    teacher_id: "3",
    teacher_name: "Mufti Abdullah Khan",
    students_count: 28,
    created_at: "2024-05-10"
  },
  {
    id: "17",
    title: "Advanced Usool Fiqh",
    title_ar: "أصول الفقه المتقدم",
    title_ur: "اعلیٰ اصول فقه",
    level: "Advanced",
    category: "Fiqh",
    description: "For students aiming to achieve mastery in Islamic legal theory. Studies the later sections of Noor-ul-Anwar along with Husami, Taozi, and Talwe to explore advanced principles.",
    fee_min: 35,
    fee_max: 50,
    duration: "12 Months",
    schedule: "3–4 days/week · 60–90 min per session",
    prerequisites: ["Intermediate Usool Fiqh"],
    core_books: ["Noor-ul-Anwar (Qiyas to end)", "Husami", "Taozi", "Talwe"],
    next_course: "",
    status: "published",
    teacher_id: "3",
    teacher_name: "Mufti Abdullah Khan",
    students_count: 15,
    created_at: "2024-06-05"
  },
  // Sarf & Nahw Courses (3)
  {
    id: "18",
    title: "Basic Sarf & Nahw",
    title_ar: "الصرف والنحو الأساسي",
    title_ur: "صرف و نحو کا ابتدائی کورس",
    level: "Beginner",
    category: "Sarf & Nahw",
    description: "Arabic letters, vowels (Harakat), simple nouns and verbs (singular, dual, plural), basic sentence structures, Quranic verse exercises, recitation practice (Ijra).",
    fee_min: 20,
    fee_max: 30,
    duration: "6 Months",
    schedule: "3–5 days/week · 45 min per session",
    prerequisites: [],
    core_books: ["Irshad-us-Sarf", "Nahw-e-Meer with Ijra"],
    next_course: "Intermediate Sarf & Nahw",
    status: "published",
    teacher_id: "4",
    teacher_name: "Ustadh Yusuf Al-Arabi",
    students_count: 42,
    created_at: "2024-01-30"
  },
  {
    id: "19",
    title: "Intermediate Sarf & Nahw",
    title_ar: "الصرف والنحو المتوسط",
    title_ur: "صرف و نحو کا وسطانی کورس",
    level: "Intermediate",
    category: "Sarf & Nahw",
    description: "Detailed verb forms (past, present, imperative), complex noun forms, grammatical cases (Marfu', Mansub, Majrur), sentence analysis, Quranic verse application.",
    fee_min: 25,
    fee_max: 35,
    duration: "10 Months",
    schedule: "3–5 days/week · 45 min per session",
    prerequisites: ["Basic Sarf & Nahw"],
    core_books: ["Ilm-us-Sigha", "Al-Kafia"],
    next_course: "Advanced Sarf & Nahw",
    status: "published",
    teacher_id: "4",
    teacher_name: "Ustadh Yusuf Al-Arabi",
    students_count: 35,
    created_at: "2024-03-01"
  },
  {
    id: "20",
    title: "Advanced Sarf & Nahw",
    title_ar: "الصرف والنحو المتقدم",
    title_ur: "صرف و نحو کا اعلیٰ کورس",
    level: "Advanced",
    category: "Sarf & Nahw",
    description: "Advanced verb forms, irregular verbs, complex sentence structures (conditional, negation, emphasis), syntax analysis of Quranic verses and Hadith, application in Tafseer.",
    fee_min: 35,
    fee_max: 50,
    duration: "8 Months",
    schedule: "3–5 days/week · 45 min per session",
    prerequisites: ["Intermediate Sarf & Nahw"],
    core_books: ["Sharah al-Jami"],
    next_course: "",
    status: "published",
    teacher_id: "4",
    teacher_name: "Ustadh Yusuf Al-Arabi",
    students_count: 22,
    created_at: "2024-04-15"
  },
  // Hadith Courses (4)
  {
    id: "21",
    title: "Basic Hadith",
    title_ar: "الحديث الأساسي",
    title_ur: "حدیث کا ابتدائی کورس",
    level: "Beginner",
    category: "Hadith",
    description: "Fundamentals of Hadith sciences (Ilm al-Hadith), basic classification (Sahih, Hasan, Da'if), selected Hadiths on daily life, morals, worship.",
    fee_min: 20,
    fee_max: 30,
    duration: "4 Months",
    schedule: "3–5 days/week · 45 min per session",
    prerequisites: [],
    core_books: ["Riyadh-us-Saliheen (selected sections)"],
    next_course: "Intermediate Hadith",
    status: "published",
    teacher_id: "1",
    teacher_name: "Dr. Noor Ur Rahman Hazarvi",
    students_count: 52,
    created_at: "2024-02-05"
  },
  {
    id: "22",
    title: "Intermediate Hadith",
    title_ar: "الحديث المتوسط",
    title_ur: "حدیث کا وسطانی کورس",
    level: "Intermediate",
    category: "Hadith",
    description: "Contextual analysis, chain of narrators (Isnad) and Hadith terminology, practical application, comparison and analysis to resolve apparent contradictions.",
    fee_min: 25,
    fee_max: 35,
    duration: "6 Months",
    schedule: "3–5 days/week · 45 min per session",
    prerequisites: ["Basic Hadith"],
    core_books: ["Mishkat al-Masabih"],
    next_course: "Advanced Hadith",
    status: "published",
    teacher_id: "1",
    teacher_name: "Dr. Noor Ur Rahman Hazarvi",
    students_count: 38,
    created_at: "2024-03-10"
  },
  {
    id: "23",
    title: "Advanced Hadith",
    title_ar: "الحديث المتقدم",
    title_ur: "حدیث کا اعلیٰ کورس",
    level: "Advanced",
    category: "Hadith",
    description: "Detailed Isnad and Matn study, Ilm al-Rijal, Ilm al-Jarh wa al-Ta'dil (authentication), application in Fiqh, Tafseer, contemporary issues, Sharah of complex Hadiths.",
    fee_min: 35,
    fee_max: 50,
    duration: "2 Years",
    schedule: "3–5 days/week · 60 min per session",
    prerequisites: ["Intermediate Hadith"],
    core_books: ["Sahih al-Bukhari", "Sahih Muslim"],
    next_course: "Takhassus fil Hadith",
    status: "published",
    teacher_id: "1",
    teacher_name: "Dr. Noor Ur Rahman Hazarvi",
    students_count: 28,
    created_at: "2024-04-20"
  },
  {
    id: "24",
    title: "Takhassus fil Hadith",
    title_ar: "تخصص في الحديث",
    title_ur: "تخصص فی الحدیث",
    level: "Specialized",
    category: "Hadith",
    description: "Highest level of Hadith education. All six major Hadith collections, advanced Sharah of complex Hadiths, detailed Isnad/Matn analysis, advanced authentication, guidance on teaching and issuing fatawa.",
    fee_min: 50,
    fee_max: 70,
    duration: "2 Years",
    schedule: "3–5 days/week · 90 min per session",
    prerequisites: ["Advanced Hadith"],
    core_books: ["Sahih al-Bukhari", "Sahih Muslim", "Sunan Abu Dawood", "Tirmidhi", "Nasa'i", "Ibn Majah"],
    next_course: "",
    status: "published",
    teacher_id: "1",
    teacher_name: "Dr. Noor Ur Rahman Hazarvi",
    students_count: 12,
    created_at: "2024-05-25"
  }
];

// Progression paths per category
const progressionPaths: Record<string, string[]> = {
  "Quran": ["Noorani Qaida", "Nazra Quran", "Quran with Tajweed", "Advanced Tajweed Program", "Hifz-ul-Quran", "Tarjamat-ul-Quran", "Advanced Tafseer-ul-Quran"],
  "Arabic Language": ["Beginner Arabic", "Intermediate Arabic", "Advanced Spoken Arabic", "Advanced Ilm-e-Balaghat"],
  "Fiqh": ["Basic Fiqh (Qudoori)", "Intermediate Fiqh (Kanz)", "Advanced Fiqh (Hidaya)", "Basic Usool Fiqh (Shashi)", "Intermediate Usool Fiqh", "Advanced Usool Fiqh"],
  "Sarf & Nahw": ["Basic Sarf & Nahw", "Intermediate Sarf & Nahw", "Advanced Sarf & Nahw"],
  "Hadith": ["Basic Hadith", "Intermediate Hadith", "Advanced Hadith", "Takhassus fil Hadith"]
};

export default function CoursesManagementPage() {
  const { t, isRTL } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newCoreBook, setNewCoreBook] = useState("");

  const itemsPerPage = 12;

  // Fetch courses from backend
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const openAddModal = () => {
    setFormData(initialFormData);
    setModalMode("add");
    setShowModal(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    // Ensure prerequisites and core_books are arrays
    const prereqs = Array.isArray(course.prerequisites) 
      ? course.prerequisites 
      : typeof course.prerequisites === 'string' 
        ? course.prerequisites.split(',').map(p => p.trim()).filter(p => p)
        : [];
    const books = Array.isArray(course.core_books) 
      ? course.core_books 
      : typeof course.core_books === 'string' 
        ? course.core_books.split(',').map(b => b.trim()).filter(b => b)
        : [];
    setFormData({
      title: course.title,
      title_ar: course.title_ar || "",
      title_ur: course.title_ur || "",
      level: course.level,
      category: course.category,
      description: course.description,
      description_ar: course.description_ar || "",
      description_ur: course.description_ur || "",
      fee_min: course.fee_min,
      fee_max: course.fee_max,
      duration: course.duration,
      schedule: course.schedule,
      prerequisites: prereqs,
      core_books: books,
      next_course: course.next_course,
      status: course.status,
      teacher_id: course.teacher_id
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const openViewModal = (course: Course) => {
    setSelectedCourse(course);
    setModalMode("view");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setFormData(initialFormData);
    setNewPrerequisite("");
    setNewCoreBook("");
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fee_min" || name === "fee_max" ? parseInt(value) || 0 : value
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite && !formData.prerequisites.includes(newPrerequisite)) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite]
      }));
    }
    setNewPrerequisite("");
  };

  const removePrerequisite = (prereq: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p) => p !== prereq)
    }));
  };

  const addCoreBook = () => {
    if (newCoreBook && !formData.core_books.includes(newCoreBook)) {
      setFormData((prev) => ({
        ...prev,
        core_books: [...prev.core_books, newCoreBook]
      }));
    }
    setNewCoreBook("");
  };

  const removeCoreBook = (book: string) => {
    setFormData((prev) => ({
      ...prev,
      core_books: prev.core_books.filter((b) => b !== book)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert arrays to comma-separated strings for database
      const prereqsString = Array.isArray(formData.prerequisites) 
        ? formData.prerequisites.join(', ') 
        : formData.prerequisites;
      const booksString = Array.isArray(formData.core_books) 
        ? formData.core_books.join(', ') 
        : formData.core_books;
      
      // Generate slug from title
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const courseData = {
        title: formData.title,
        slug: slug,
        level: formData.level,
        category: formData.category,
        description: formData.description,
        duration: formData.duration,
        schedule: formData.schedule,
        fee_min: formData.fee_min,
        fee_max: formData.fee_max,
        prerequisites: prereqsString,
        core_books: booksString,
        next_course: formData.next_course,
        status: formData.status,
        teacher_id: formData.teacher_id || null,
        display_order: 0
      };

      if (modalMode === "add") {
        // Create new course via API
        const res = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        // Add to local state
        setCourses((prev) => [data.course, ...prev]);
      } else if (modalMode === "edit" && selectedCourse) {
        // Update course via API
        const res = await fetch('/api/admin/courses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedCourse.id, ...courseData })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        // Update local state
        setCourses((prev) =>
          prev.map((c) => c.id === selectedCourse.id ? data.course : c)
        );
      }
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving course:", error);
      alert("Failed to save course: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!courseToDelete) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses?id=${courseToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete));
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
    } catch (error: unknown) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      published: "bg-green-100 text-green-700 border-green-200",
      draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
      archived: "bg-gray-100 text-gray-700 border-gray-200"
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.draft}`}
      >
        <CheckCircle className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Level badge component
  const LevelBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      Beginner: "bg-blue-100 text-blue-700",
      Intermediate: "bg-purple-100 text-purple-700",
      Advanced: "bg-orange-100 text-orange-700",
      Specialized: "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[level] || colors.Beginner}`}>
        {level}
      </span>
    );
  };

  // Category badge component
  const CategoryBadge = ({ category }: { category: string }) => {
    const colors: Record<string, string> = {
      Quran: "bg-emerald-100 text-emerald-700",
      "Arabic Language": "bg-cyan-100 text-cyan-700",
      Fiqh: "bg-amber-100 text-amber-700",
      "Sarf & Nahw": "bg-pink-100 text-pink-700",
      Hadith: "bg-violet-100 text-violet-700"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[category] || colors.Quran}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="admin" />

      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div>
              <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.courses.title") || "Courses Management"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.courses.subtitle") || "Manage all 24 courses across 5 disciplines"}
              </p>
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors">
                <Download className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.export") || "Export"}</span>
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.addCourse") || "Add Course"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: t("admin.courses.total") || "Total Courses", value: courses.length, icon: BookOpen, color: "#8B5CF6" },
            { label: "Quran", value: courses.filter((c) => c.category === "Quran").length, icon: BookOpen, color: "#10B981" },
            { label: "Arabic", value: courses.filter((c) => c.category === "Arabic Language").length, icon: BookOpen, color: "#06B6D4" },
            { label: "Fiqh", value: courses.filter((c) => c.category === "Fiqh").length, icon: BookOpen, color: "#F59E0B" },
            { label: "Hadith", value: courses.filter((c) => c.category === "Hadith").length, icon: BookOpen, color: "#8B5CF6" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card p-4 rounded-xl border border-[var(--border)]"
            >
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div>
                  <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progression Paths Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card p-6 rounded-xl border border-[var(--border)] mb-8"
        >
          <h2 className={`text-lg font-bold text-[var(--text-primary)] mb-4 ${isRTL ? "arabic-text" : ""}`}>
            {t("admin.courses.progressionPaths") || "Course Progression Paths"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(progressionPaths).map(([category, path]) => (
              <div key={category} className="p-4 bg-[var(--background-green)] rounded-xl">
                <CategoryBadge category={category} />
                <div className={`flex flex-wrap items-center gap-1 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {path.map((course, index) => (
                    <div key={course} className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className={`text-xs text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                        {course.split(" ")[0]}
                      </span>
                      {index < path.length - 1 && (
                        isRTL ? <ArrowLeft className="w-3 h-3 text-[var(--text-muted)] mx-1" /> : <ArrowRight className="w-3 h-3 text-[var(--text-muted)] mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card p-4 rounded-xl border border-[var(--border)] mb-6"
        >
          <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div className="flex-1 relative">
              <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
              <input
                type="text"
                placeholder={t("admin.courses.searchPlaceholder") || "Search courses..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? "pr-10 pl-4 arabic-text" : "pl-10 pr-4"} py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]`}
              />
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.courses.allCategories") || "All Categories"}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.courses.allLevels") || "All Levels"}</option>
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.courses.allStatus") || "All Status"}</option>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.loading") || "Loading..."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Course Header */}
                <div className="relative p-4 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--background-green)]">
                  <div className={`flex items-start justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <CategoryBadge category={course.category} />
                    <StatusBadge status={course.status} />
                  </div>
                  <h3 className={`font-bold text-[var(--text-primary)] text-lg mb-1 line-clamp-2 ${isRTL ? "arabic-text" : ""}`}>
                    {course.title}
                  </h3>
                  <LevelBadge level={course.level} />
                </div>

                {/* Course Info */}
                <div className="p-4 space-y-3">
                  <p className={`text-sm text-[var(--text-muted)] line-clamp-2 ${isRTL ? "arabic-text" : ""}`}>
                    {course.description}
                  </p>

                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Clock className="w-4 h-4 text-[var(--primary)]" />
                      <span className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>{course.duration}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <DollarSign className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-[var(--text-secondary)]">${course.fee_min}–${course.fee_max}/mo</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Users className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-[var(--text-secondary)]">{course.students_count} students</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <GraduationCap className="w-4 h-4 text-[var(--primary)]" />
                      <span className={`text-[var(--text-secondary)] truncate ${isRTL ? "arabic-text" : ""}`}>{course.teacher_name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-2 pt-3 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => openViewModal(course)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.view") || "View"}</span>
                    </button>
                    <button
                      onClick={() => openEditModal(course)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors text-xs"
                    >
                      <Edit className="w-3 h-3" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.edit") || "Edit"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCourseToDelete(course.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center justify-between mt-6 p-4 bg-card rounded-xl border border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.showing") || "Showing"} {(currentPage - 1) * itemsPerPage + 1} {t("admin.to") || "to"}{" "}
              {Math.min(currentPage * itemsPerPage, filteredCourses.length)} {t("admin.of") || "of"} {filteredCourses.length}{" "}
              {t("admin.courses.results") || "courses"}
            </p>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg ${
                      currentPage === page
                        ? "bg-[var(--primary)] text-white"
                        : "border border-[var(--border)] hover:bg-[var(--background-green)]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className={`text-xl font-semibold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.courses.noResults") || "No courses found"}
            </h3>
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.courses.tryDifferent") || "Try adjusting your search or filter criteria"}
            </p>
          </motion.div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--background)] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto my-8 shadow-2xl border border-[var(--border)]"
            >
              {/* Modal Header */}
              <div className={`sticky top-0 bg-card flex items-center justify-between p-6 border-b border-[var(--border)] z-10 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {modalMode === "add"
                    ? t("admin.courses.addCourse") || "Add New Course"
                    : modalMode === "edit"
                    ? t("admin.courses.editCourse") || "Edit Course"
                    : t("admin.courses.viewCourse") || "Course Details"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Modal Content */}
              {modalMode === "view" && selectedCourse ? (
                <div className="p-6 space-y-6">
                  {/* Course Header */}
                  <div className="p-6 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--background-green)] rounded-xl">
                    <div className={`flex items-start justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <CategoryBadge category={selectedCourse.category} />
                      <StatusBadge status={selectedCourse.status} />
                    </div>
                    <h3 className={`text-2xl font-bold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {selectedCourse.title}
                    </h3>
                    {selectedCourse.title_ar && (
                      <p className={`text-lg text-[var(--text-secondary)] mb-1 ${isRTL ? "arabic-text" : ""}`}>
                        {selectedCourse.title_ar}
                      </p>
                    )}
                    {selectedCourse.title_ur && (
                      <p className={`text-lg text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedCourse.title_ur}
                      </p>
                    )}
                    <div className={`flex items-center gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <LevelBadge level={selectedCourse.level} />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.courses.description") || "Description"}
                    </h4>
                    <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                      {selectedCourse.description}
                    </p>
                  </div>

                  {/* Course Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <Clock className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.duration") || "Duration"}</p>
                      <p className={`font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedCourse.duration}</p>
                    </div>
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <DollarSign className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.fee") || "Fee/Month"}</p>
                      <p className="font-semibold text-[var(--text-primary)]">${selectedCourse.fee_min}–${selectedCourse.fee_max}</p>
                    </div>
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <Users className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.students") || "Students"}</p>
                      <p className="font-semibold text-[var(--text-primary)]">{selectedCourse.students_count}</p>
                    </div>
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <Calendar className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.schedule") || "Schedule"}</p>
                      <p className={`text-xs font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedCourse.schedule}</p>
                    </div>
                  </div>

                  {/* Teacher */}
                  <div className={`flex items-center gap-4 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                      {selectedCourse.teacher_name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.instructor") || "Instructor"}</p>
                      <p className={`font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedCourse.teacher_name}</p>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                    <div>
                      <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.prerequisites") || "Prerequisites"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(selectedCourse.prerequisites) 
                          ? selectedCourse.prerequisites 
                          : [selectedCourse.prerequisites]
                        ).map((prereq, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg text-sm ${isRTL ? "arabic-text" : ""}`}
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Core Books */}
                  {selectedCourse.core_books && (
                    <div>
                      <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.coreBooks") || "Core Books"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(selectedCourse.core_books) 
                          ? selectedCourse.core_books 
                          : [selectedCourse.core_books]
                        ).map((book, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-2 px-3 py-2 bg-[var(--background-green)] text-[var(--text-primary)] rounded-lg text-sm border border-[var(--border)] ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                          >
                            <FileText className="w-4 h-4 text-[var(--primary)]" />
                            {book}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Course */}
                  {selectedCourse.next_course && (
                    <div className={`flex items-center gap-3 p-4 border border-[var(--border)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                      <ArrowRight className={`w-5 h-5 text-[var(--primary)] ${isRTL ? "rotate-180" : ""}`} />
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.nextCourse") || "Next Course"}</p>
                        <p className={`font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedCourse.next_course}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => {
                        closeModal();
                        openEditModal(selectedCourse);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.editCourse") || "Edit Course"}</span>
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                    >
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.close") || "Close"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.title") || "Title (English)"} *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.titleAr") || "Title (Arabic)"}
                      </label>
                      <input
                        type="text"
                        name="title_ar"
                        value={formData.title_ar}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] arabic-text`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.titleUr") || "Title (Urdu)"}
                      </label>
                      <input
                        type="text"
                        name="title_ur"
                        value={formData.title_ur}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] arabic-text`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.category") || "Category"} *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.level") || "Level"} *
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        {levels.map((lvl) => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.status") || "Status"} *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.duration") || "Duration"} *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 3 Months"
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.schedule") || "Schedule"} *
                      </label>
                      <input
                        type="text"
                        name="schedule"
                        value={formData.schedule}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 3–5 days/week · 45 min"
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.feeMin") || "Min Fee ($)"} *
                      </label>
                      <input
                        type="number"
                        name="fee_min"
                        value={formData.fee_min}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.feeMax") || "Max Fee ($)"} *
                      </label>
                      <input
                        type="number"
                        name="fee_max"
                        value={formData.fee_max}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.description") || "Description (English)"} *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.descriptionAr") || "Description (Arabic)"}
                      </label>
                      <textarea
                        name="description_ar"
                        value={formData.description_ar}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none arabic-text`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.descriptionUr") || "Description (Urdu)"}
                      </label>
                      <textarea
                        name="description_ur"
                        value={formData.description_ur}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none arabic-text`}
                      />
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.courses.form.prerequisites") || "Prerequisites"}
                    </label>
                    <div className={`flex gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <select
                        value={newPrerequisite}
                        onChange={(e) => setNewPrerequisite(e.target.value)}
                        className={`flex-1 px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        <option value="">{t("admin.courses.form.selectPrerequisite") || "Select Prerequisite"}</option>
                        {courses
                          .filter((c) => !(formData.prerequisites || []).includes(c.title))
                          .map((c) => (
                            <option key={c.id} value={c.title}>{c.title}</option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={addPrerequisite}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.prerequisites || []).map((prereq) => (
                        <span
                          key={prereq}
                          className={`inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                        >
                          {prereq}
                          <button type="button" onClick={() => removePrerequisite(prereq)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Core Books */}
                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.courses.form.coreBooks") || "Core Books"}
                    </label>
                    <div className={`flex gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <input
                        type="text"
                        value={newCoreBook}
                        onChange={(e) => setNewCoreBook(e.target.value)}
                        placeholder={t("admin.courses.form.enterBook") || "Enter book name..."}
                        className={`flex-1 px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={addCoreBook}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.core_books || []).map((book) => (
                        <span
                          key={book}
                          className={`inline-flex items-center gap-2 px-3 py-1 bg-[var(--background-green)] text-[var(--text-primary)] rounded-full text-sm border border-[var(--border)] ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                        >
                          <FileText className="w-3 h-3 text-[var(--primary)]" />
                          {book}
                          <button type="button" onClick={() => removeCoreBook(book)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Next Course */}
                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.courses.form.nextCourse") || "Next Course in Progression"}
                    </label>
                    <select
                      name="next_course"
                      value={formData.next_course}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                    >
                      <option value="">{t("admin.courses.form.none") || "None (End of Path)"}</option>
                      {courses
                        .filter((c) => c.category === formData.category && c.title !== formData.title)
                        .map((c) => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                    </select>
                  </div>

                  {/* Form Actions */}
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                    >
                      {modalMode === "add" ? (
                        <>
                          <Plus className="w-4 h-4" />
                          <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.addCourse") || "Add Course"}</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.updateCourse") || "Update Course"}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                    >
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.cancel") || "Cancel"}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className={`text-xl font-bold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {t("admin.courses.deleteConfirm.title") || "Delete Course?"}
                </h3>
                <p className={`text-[var(--text-muted)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                  {t("admin.courses.deleteConfirm.message") || "This action cannot be undone. The course will be permanently removed from the system."}
                </p>
                <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.deleteConfirm.confirm") || "Delete"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setCourseToDelete(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                  >
                    <span className={isRTL ? "arabic-text" : ""}>{t("admin.cancel") || "Cancel"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
