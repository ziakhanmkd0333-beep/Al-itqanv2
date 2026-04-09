"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { courses } from "@/lib/courses-data";
import { 
  Send, CheckCircle, User, Mail, Phone, MapPin, BookOpen, Clock, Calendar, 
  Lock, Eye, EyeOff, GraduationCap, FileText, Award, Briefcase, Languages,
  Upload, X, FileCheck, Building, CreditCard
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Floating particles for background - will be generated client-side only
interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

// Country list
const countries = [
  "Afghanistan", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", 
  "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt", "France", 
  "Germany", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
  "Italy", "Japan", "Jordan", "Kenya", "Kuwait", "Libya", "Malaysia", 
  "Mexico", "Morocco", "Netherlands", "Nigeria", "Norway", "Oman", "Pakistan", 
  "Palestine", "Philippines", "Poland", "Portugal", "Qatar", "Russia", 
  "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", 
  "Sweden", "Switzerland", "Syria", "Thailand", "Turkey", "UAE", "UK", 
  "Ukraine", "USA", "Yemen", "Other"
];

// Qualifications list
const qualifications = [
  "Hafiz-e-Quran", "Alim/Aalimah Course", "Islamic Studies Degree",
  "Arabic Language Degree", "Bachelors in Islamic Studies", 
  "Masters in Islamic Studies", "PhD in Islamic Studies",
  "Tajweed Certification", "Other"
];

// Teaching experience options
const experienceOptions = [
  "Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10+ years"
];

export default function AdmissionPage() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");
  
  // Student form state
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    age: "",
    language: "en",
    courseId: "",
    preferredTiming: "",
    startDate: "",
    guardianName: "",
    guardianPhone: "",
    message: "",
    password: "",
    confirmPassword: ""
  });
  
  // Teacher form state
  const [teacherForm, setTeacherForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    qualification: "",
    experience: "",
    specialization: "",
    languagesKnown: [] as string[],
    cvFile: null as File | null,
    certificationFile: null as File | null,
    password: "",
    confirmPassword: ""
  });
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [certFileName, setCertFileName] = useState("");
  
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
  
  const cvInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  // Check if minor
  const checkMinor = (age: string) => {
    setIsMinor(parseInt(age) < 18);
  };

  // Handle student form change
  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
    if (name === "age") checkMinor(value);
  };

  // Handle teacher form change
  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeacherForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle language checkbox for teacher
  const handleLanguageToggle = (lang: string) => {
    setTeacherForm(prev => ({
      ...prev,
      languagesKnown: prev.languagesKnown.includes(lang)
        ? prev.languagesKnown.filter(l => l !== lang)
        : [...prev.languagesKnown, lang]
    }));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "cv" | "cert") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      if (type === "cv") {
        setTeacherForm(prev => ({ ...prev, cvFile: file }));
        setCvFileName(file.name);
      } else {
        setTeacherForm(prev => ({ ...prev, certificationFile: file }));
        setCertFileName(file.name);
      }
    }
  };

  // Validate password
  const validatePassword = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) return "Passwords do not match";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
  };

  // Submit student form
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(studentForm.password, studentForm.confirmPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (isMinor && (!studentForm.guardianName || !studentForm.guardianPhone)) {
      setError("Guardian information is required for minors");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: studentForm.email,
          password: studentForm.password,
          fullName: studentForm.fullName,
          phone: studentForm.phone,
          country: studentForm.country,
          age: parseInt(studentForm.age),
          language: studentForm.language,
          courseId: studentForm.courseId,
          preferredTiming: studentForm.preferredTiming,
          startDate: studentForm.startDate,
          guardianName: isMinor ? studentForm.guardianName : null,
          guardianPhone: isMinor ? studentForm.guardianPhone : null,
          message: studentForm.message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit teacher form
  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(teacherForm.password, teacherForm.confirmPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!teacherForm.cvFile) {
      setError("CV/Resume is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('email', teacherForm.email);
      formData.append('password', teacherForm.password);
      formData.append('fullName', teacherForm.fullName);
      formData.append('phone', teacherForm.phone);
      formData.append('country', teacherForm.country);
      formData.append('qualification', teacherForm.qualification);
      formData.append('experience', teacherForm.experience);
      formData.append('specialization', teacherForm.specialization);
      formData.append('languagesKnown', JSON.stringify(teacherForm.languagesKnown));
      if (teacherForm.cvFile) formData.append('cvFile', teacherForm.cvFile);
      if (teacherForm.certificationFile) formData.append('certificationFile', teacherForm.certificationFile);

      const response = await fetch('/api/register/teacher', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="pt-32 pb-20 bg-[var(--background)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-3xl p-8 md:p-12 text-center shadow-xl border border-[var(--border)]"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {t("admission.success.status")}
              </div>
              <h2 className={`text-[var(--text-primary)] text-2xl md:text-3xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("admission.success.title")}
              </h2>
              <p className={`text-[var(--text-secondary)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                {t("admission.success.description")}
              </p>
              <div className="bg-[var(--background-green)] rounded-xl p-6 mb-6">
                <p className={`text-[var(--text-muted)] text-sm mb-2 ${isRTL ? "arabic-text text-right" : ""}`}>
                  {t("admission.success.whatNext")}
                </p>
                <ol className={`text-[var(--text-secondary)] text-sm space-y-2 ${isRTL ? "arabic-text text-right" : "text-left"}`}>
                  <li>{isRTL ? "1. " : "1. "}{t("admission.success.step1")}</li>
                  <li>{isRTL ? "2. " : "2. "}{t("admission.success.step2")}</li>
                  <li>{isRTL ? "3. " : "3. "}{t("admission.success.step3")}</li>
                  <li>{isRTL ? "4. " : "4. "}{t("admission.success.step4")}</li>
                </ol>
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
                <Link
                  href="/auth/login"
                  className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  {t("admission.success.login")}
                </Link>
                <Link
                  href="/"
                  className="inline-block bg-[var(--background-green)] hover:bg-[var(--primary)]/10 text-[var(--primary)] px-8 py-3 rounded-xl font-semibold transition-colors border border-[var(--primary)]"
                >
                  {t("admission.success.home")}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Header - Enhanced Hero Section */}
      <section className="relative pt-32 pb-16 min-h-[55vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/admission-hero.png"
            alt={t("admission.title")}
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
                <pattern id="admission-hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
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
              <rect width="100%" height="100%" fill="url(#admission-hero-pattern)" />
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
                {t("admission.subtitle")}
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
                {t("admission.title")}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isRTL ? "arabic-text" : ""}`}
            >
              {t("admission.description")}
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

      {/* Form */}
      <section className="py-12 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border border-[var(--border)]"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Tab Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                type="button"
                onClick={() => setActiveTab("student")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                  activeTab === "student"
                    ? "bg-[var(--primary)] text-white shadow-lg"
                    : "bg-[var(--background-green)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
                } ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
              >
                <User className="w-5 h-5" />
                {t("admission.registerStudent")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("teacher")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                  activeTab === "teacher"
                    ? "bg-[var(--primary)] text-white shadow-lg"
                    : "bg-[var(--background-green)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
                } ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
              >
                <GraduationCap className="w-5 h-5" />
                {t("admission.registerTeacher")}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "student" ? (
                <motion.form
                  key="student-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleStudentSubmit}
                >
                  <div className="mb-8">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <User className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.personalInfo")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.fullName")} *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={studentForm.fullName}
                          onChange={handleStudentChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          placeholder={t("admission.placeholders.fullName")}
                        />
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.email")} *
                        </label>
                        <div className="relative">
                          <Mail className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="email"
                            name="email"
                            required
                            value={studentForm.email}
                            onChange={handleStudentChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.placeholders.email")}
                          />
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.phone")} *
                        </label>
                        <div className="relative">
                          <Phone className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={studentForm.phone}
                            onChange={handleStudentChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.placeholders.phone")}
                          />
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.country")} *
                        </label>
                        <select
                          name="country"
                          required
                          value={studentForm.country}
                          onChange={handleStudentChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        >
                          <option value="">{t("admin.admissions.table.country")}</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.age")} *
                        </label>
                        <input
                          type="number"
                          name="age"
                          required
                          min="5"
                          max="100"
                          value={studentForm.age}
                          onChange={handleStudentChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          placeholder={t("admission.placeholders.age")}
                        />
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.language")} *
                        </label>
                        <select
                          name="language"
                          required
                          value={studentForm.language}
                          onChange={handleStudentChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        >
                          <option value="en">{t("languages.en")}</option>
                          <option value="ur">{t("languages.ur")}</option>
                          <option value="ar">{t("languages.ar")}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <Lock className="w-5 h-5 text-[var(--primary)]" />
                      {t("login.password")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.password")} *
                        </label>
                        <div className="relative">
                          <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            minLength={8}
                            value={studentForm.password}
                            onChange={handleStudentChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.form.passwordRequirements")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("login.passwordPlaceholder")} *
                        </label>
                        <div className="relative">
                          <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            required
                            minLength={8}
                            value={studentForm.confirmPassword}
                            onChange={handleStudentChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("login.passwordPlaceholder")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Selection */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.courseSelection")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`md:col-span-2 ${isRTL ? "text-right" : ""}`}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.course")} *
                        </label>
                        <select
                          name="courseId"
                          required
                          value={studentForm.courseId}
                          onChange={handleStudentChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        >
                          <option value="">{t("admission.form.course")}</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {isRTL ? t(`courseData.${course.id}.title`) : course.title} ({t(`levels.${course.level.toLowerCase()}`)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.timing")} *
                        </label>
                        <select
                          name="preferredTiming"
                          required
                          value={studentForm.preferredTiming}
                          onChange={handleStudentChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        >
                          <option value="">{t("admission.form.timing")}</option>
                          <option value="morning">{t("admission.form.timingOptions.morning")}</option>
                          <option value="afternoon">{t("admission.form.timingOptions.afternoon")}</option>
                          <option value="evening">{t("admission.form.timingOptions.evening")}</option>
                          <option value="flexible">{t("admission.form.timingOptions.flexible")}</option>
                        </select>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admin.admissions.table.applied")} *
                        </label>
                        <div className="relative">
                          <Calendar className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="date"
                            name="startDate"
                            required
                            value={studentForm.startDate}
                            onChange={handleStudentChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information (for minors) */}
                  {isMinor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 pt-8 border-t border-[var(--border)]"
                    >
                      <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                        <User className="w-5 h-5 text-[var(--primary)]" />
                        {t("admission.guardianInfo")}
                        <span className={`text-sm font-normal text-[var(--text-muted)] ${isRTL ? "mr-2" : "ml-2"}`}>({t("admission.guardianInfoNote")})</span>
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={isRTL ? "text-right" : ""}>
                          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                            {t("admission.form.guardianName")} *
                          </label>
                          <input
                            type="text"
                            name="guardianName"
                            required={isMinor}
                            value={studentForm.guardianName}
                            onChange={handleStudentChange}
                            className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.form.guardianName")}
                          />
                        </div>

                        <div className={isRTL ? "text-right" : ""}>
                          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                            {t("admission.form.guardianPhone")} *
                          </label>
                          <div className="relative">
                            <Phone className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                            <input
                              type="tel"
                              name="guardianPhone"
                              required={isMinor}
                              value={studentForm.guardianPhone}
                              onChange={handleStudentChange}
                              className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                              placeholder={t("admission.form.guardianPhone")}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Additional Message */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <FileText className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.additionalMessage")}
                    </h2>

                    <textarea
                      name="message"
                      rows={4}
                      value={studentForm.message}
                      onChange={handleStudentChange}
                      className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none ${isRTL ? "text-right" : ""}`}
                      placeholder={t("admission.placeholders.message")}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("contact.send")}
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="teacher-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleTeacherSubmit}
                >
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <User className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.personalInfo")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.fullName")} *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={teacherForm.fullName}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          placeholder={t("admission.placeholders.fullName")}
                        />
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.email")} *
                        </label>
                        <div className="relative">
                          <Mail className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="email"
                            name="email"
                            required
                            value={teacherForm.email}
                            onChange={handleTeacherChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.placeholders.email")}
                          />
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.phone")} *
                        </label>
                        <div className="relative">
                          <Phone className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={teacherForm.phone}
                            onChange={handleTeacherChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.placeholders.phone")}
                          />
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.country")} *
                        </label>
                        <select
                          name="country"
                          required
                          value={teacherForm.country}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        >
                          <option value="">{t("admin.admissions.table.country")}</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <Briefcase className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.teacherInfo")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.qualification")} *
                        </label>
                        <select
                          name="qualification"
                          required
                          value={teacherForm.qualification}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        >
                          <option value="">{t("admission.form.selectQualification")}</option>
                          {qualifications.map(qual => (
                            <option key={qual} value={qual}>{qual}</option>
                          ))}
                        </select>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.experience")} *
                        </label>
                        <select
                          name="experience"
                          required
                          value={teacherForm.experience}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        >
                          <option value="">{t("admission.form.selectExperience")}</option>
                          {experienceOptions.map(exp => (
                            <option key={exp} value={exp}>{exp}</option>
                          ))}
                        </select>
                      </div>

                      <div className={`md:col-span-2 ${isRTL ? "text-right" : ""}`}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.specialization")} *
                        </label>
                        <select
                          name="specialization"
                          required
                          value={teacherForm.specialization}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        >
                          <option value="">{t("admission.form.specialization")}</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {isRTL ? t(`courseData.${course.id}.title`) : course.title}
                            </option>
                          ))}
                          <option value="all">{t("categories.all")}</option>
                        </select>
                      </div>

                      <div className={`md:col-span-2 ${isRTL ? "text-right" : ""}`}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.languagesKnown")} *
                        </label>
                        <div className={`flex flex-wrap gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                          {["English", "Urdu", "Arabic", "Hindi", "Punjabi", "Bengali", "Persian", "Other"].map(lang => (
                            <label
                              key={lang}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                                teacherForm.languagesKnown.includes(lang)
                                  ? "bg-[var(--primary)] text-white"
                                  : "bg-[var(--background-green)] text-[var(--text-primary)] hover:bg-[var(--primary)]/10"
                              } ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={teacherForm.languagesKnown.includes(lang)}
                                onChange={() => handleLanguageToggle(lang)}
                                className="sr-only"
                              />
                              {lang === "English" ? t("languages.en") : 
                               lang === "Urdu" ? t("languages.ur") : 
                               lang === "Arabic" ? t("languages.ar") : lang}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <FileText className="w-5 h-5 text-[var(--primary)]" />
                      {t("admin.sidebar.admissions")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.cvFile")} *
                        </label>
                        <input
                          ref={cvInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, "cv")}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => cvInputRef.current?.click()}
                          className={`w-full py-4 px-4 rounded-xl border-2 border-dashed transition-colors flex items-center justify-center gap-3 ${
                            cvFileName
                              ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                              : "border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-muted)]"
                          } ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {cvFileName ? (
                            <>
                              <FileCheck className="w-5 h-5" />
                              <span className="truncate max-w-[200px]">{cvFileName}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              {t("admission.form.cvPlaceholder")}
                            </>
                          )}
                        </button>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.certificationFile")}
                        </label>
                        <input
                          ref={certInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, "cert")}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => certInputRef.current?.click()}
                          className={`w-full py-4 px-4 rounded-xl border-2 border-dashed transition-colors flex items-center justify-center gap-3 ${
                            certFileName
                              ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                              : "border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-muted)]"
                          } ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {certFileName ? (
                            <>
                              <FileCheck className="w-5 h-5" />
                              <span className="truncate max-w-[200px]">{certFileName}</span>
                            </>
                          ) : (
                            <>
                              <Award className="w-5 h-5" />
                              {t("admission.form.certificationPlaceholder")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <Lock className="w-5 h-5 text-[var(--primary)]" />
                      {t("login.password")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.password")} *
                        </label>
                        <div className="relative">
                          <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            minLength={8}
                            value={teacherForm.password}
                            onChange={handleTeacherChange}
                            className={`w-full py-3 ${isRTL ? "pl-12 pr-12" : "pl-12 pr-12"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.form.passwordRequirements")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("login.passwordPlaceholder")} *
                        </label>
                        <div className="relative">
                          <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            required
                            minLength={8}
                            value={teacherForm.confirmPassword}
                            onChange={handleTeacherChange}
                            className={`w-full py-3 ${isRTL ? "pl-12 pr-12" : "pl-12 pr-12"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("login.passwordPlaceholder")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("admission.title")}
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
