"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle, ScrollText, FileUp, Upload } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Floating particles for background - generated client-side to avoid hydration mismatch
interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface FatawaFormData {
  name: string;
  email: string;
  subject: string;
  question: string;
  file: File | null;
}

export default function ContactPage() {
  const { t, isRTL } = useTranslation();
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Fatawa Hadessya form state
  const [fatawaForm, setFatawaForm] = useState<FatawaFormData>({
    name: "",
    email: "",
    subject: "",
    question: "",
    file: null
  });
  const [fatawaSubmitting, setFatawaSubmitting] = useState(false);
  const [fatawaSubmitted, setFatawaSubmitted] = useState(false);
  const [fatawaError, setFatawaError] = useState("");
  
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
  
  const handleFatawaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFatawaForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFatawaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFatawaForm(prev => ({ ...prev, file }));
  };

  const handleFatawaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFatawaSubmitting(true);
    setFatawaError("");
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", fatawaForm.name);
      formDataToSend.append("email", fatawaForm.email);
      formDataToSend.append("subject", fatawaForm.subject);
      formDataToSend.append("question", fatawaForm.question);
      formDataToSend.append("type", "fatawa");
      if (fatawaForm.file) {
        formDataToSend.append("file", fatawaForm.file);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit question");
      }
      
      setFatawaSubmitted(true);
      setFatawaForm({ name: "", email: "", subject: "", question: "", file: null });
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setFatawaError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setFatawaSubmitting(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.emailUs"),
      details: ["info@itqaninstitute.com"],
      color: "#1A7A4A"
    },
    {
      icon: Phone,
      title: t("contact.callWhatsApp"),
      details: ["+923434487450", "+923434487450"],
      color: "#C9A84C"
    },
    {
      icon: MapPin,
      title: t("contact.location"),
      details: [t("footer.onlineClasses"), t("contact.headquarters") || "Headquarters: Pakistan"],
      color: "#27A862"
    },
    {
      icon: Clock,
      title: t("contact.officeHours"),
      details: [t("contact.hours") || "Mon-Sat: 9AM - 9PM", t("contact.sundayHours") || "Sunday: 10AM - 6PM"],
      color: "#4A6B58"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("contact.error") || "Failed to send message");
      }
      
      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Fatawa Hadessya Featured Section */}
      <section className="relative pt-8 pb-12 bg-gradient-to-b from-[#E8F5E9] via-[#F1F8E9] to-[#FFF8E1] overflow-hidden">
        {/* Decorative Islamic Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="fatawa-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path
                  d="M40 0L80 20L80 60L40 80L0 60L0 20Z"
                  fill="none"
                  stroke="#1A7A4A"
                  strokeWidth="0.5"
                />
                <circle cx="40" cy="40" r="15" fill="none" stroke="#C9A84C" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fatawa-pattern)" />
          </svg>
        </div>

        {/* Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1A7A4A] via-[#C9A84C] to-[#1A7A4A]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            {/* Icon and Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1A7A4A] to-[#27A862] shadow-lg mb-4"
            >
              <span className="text-2xl">🕌</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
              <span className="bg-gradient-to-r from-[#1A7A4A] via-[#27A862] to-[#C9A84C] bg-clip-text text-transparent">
                فتاویٰ حدیثیہ
              </span>
            </h1>
            <p className="text-[#1A7A4A] text-lg md:text-xl font-semibold tracking-wide">
              Fatawa Hadessya
            </p>
          </motion.div>

          {/* Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border-2 border-[#C9A84C]/30 mb-8"
          >
            <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                <ScrollText className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <div>
                <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                  This section provides users the opportunity to submit their questions related to Hadith (حدیث), Islamic rulings, and scholarly matters. All queries are reviewed and answered by qualified scholars with authentic Hadith references.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fatawa Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border border-[#1A7A4A]/20"
          >
            {fatawaSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1A7A4A] to-[#27A862] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-[var(--text-primary)] text-2xl font-bold mb-3 ${isRTL ? "arabic-text" : ""}`}>
                  سوال کامیابی سے جمع ہو گیا
                </h3>
                <p className="text-[#1A7A4A] text-lg font-semibold mb-2">Question Submitted Successfully</p>
                <p className={`text-[var(--text-muted)] max-w-md mx-auto ${isRTL ? "arabic-text" : ""}`}>
                  Your question has been received. Our scholars will review it and respond within 24-72 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFatawaSubmit} className="space-y-6">
                {/* Error Message */}
                {fatawaError && (
                  <div className={`p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm ${isRTL ? "text-right arabic-text" : ""}`}>
                    {fatawaError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className={isRTL ? "text-right" : ""}>
                    <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      Full Name / پورا نام *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={fatawaForm.name}
                      onChange={handleFatawaChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8F5E9] bg-white text-[var(--text-primary)] focus:outline-none focus:border-[#1A7A4A] transition-colors ${isRTL ? "text-right" : ""}`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className={isRTL ? "text-right" : ""}>
                    <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      Email Address / ای میل *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={fatawaForm.email}
                      onChange={handleFatawaChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8F5E9] bg-white text-[var(--text-primary)] focus:outline-none focus:border-[#1A7A4A] transition-colors ${isRTL ? "text-right" : ""}`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className={isRTL ? "text-right" : ""}>
                  <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    Subject / Topic / موضوع *
                  </label>
                  <select
                    name="subject"
                    required
                    value={fatawaForm.subject}
                    onChange={handleFatawaChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8F5E9] bg-white text-[var(--text-primary)] focus:outline-none focus:border-[#1A7A4A] transition-colors ${isRTL ? "text-right" : ""}`}
                  >
                    <option value="">Select a topic / موضوع منتخب کریں</option>
                    <option value="hadith">Hadith (حدیث)</option>
                    <option value="fiqh">Islamic Rulings (فقہ)</option>
                    <option value="aqeedah">Aqeedah (عقیدہ)</option>
                    <option value="seerah">Seerah (سیرت)</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                {/* Question */}
                <div className={isRTL ? "text-right" : ""}>
                  <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    Your Question / سوال *
                  </label>
                  <textarea
                    name="question"
                    required
                    rows={6}
                    value={fatawaForm.question}
                    onChange={handleFatawaChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 border-[#E8F5E9] bg-white text-[var(--text-primary)] focus:outline-none focus:border-[#1A7A4A] transition-colors resize-none ${isRTL ? "text-right arabic-text" : ""}`}
                    placeholder="تفصیل کے ساتھ سوال لکھیں... / Write your question in detail..."
                  />
                </div>

                {/* File Upload */}
                <div className={isRTL ? "text-right" : ""}>
                  <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    Attach File (Optional) / فائل منسلک کریں
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="file"
                      onChange={handleFatawaFileChange}
                      className="hidden"
                      id="fatawa-file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="fatawa-file"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-[#C9A84C]/50 bg-[#FFF8E1]/30 cursor-pointer hover:bg-[#FFF8E1]/50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Upload className="w-5 h-5 text-[#C9A84C]" />
                      <span className={`text-[var(--text-secondary)] text-sm ${isRTL ? "arabic-text" : ""}`}>
                        {fatawaForm.file ? fatawaForm.file.name : "Click to upload file (PDF, DOC, Images)"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Note */}
                <div className={`flex items-start gap-3 p-4 bg-[#E8F5E9]/50 rounded-xl ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <Clock className="w-5 h-5 text-[#1A7A4A] flex-shrink-0 mt-0.5" />
                  <p className={`text-sm text-[#1A7A4A] ${isRTL ? "arabic-text" : ""}`}>
                    Responses may take 24-72 hours. All queries will be kept confidential and secure. / جواب 24-72 گھنٹوں میں دیا جائے گا اور تمام سوالات خفیہ رکھے جائیں گے۔
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={fatawaSubmitting}
                  className={`w-full bg-gradient-to-r from-[#1A7A4A] to-[#27A862] hover:from-[#145C38] hover:to-[#1A7A4A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${isRTL ? "flex-row-reverse arabic-text" : ""}`}
                >
                  {fatawaSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Your Question / سوال جمع کریں</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 min-h-[45vh] flex items-center overflow-hidden">
        {/* Background with Gradient */}
        <div className="absolute inset-0 z-0">
          {/* Base Gradient */}
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
                <pattern id="contact-hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
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
              <rect width="100%" height="100%" fill="url(#contact-hero-pattern)" />
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
                {t("contact.subtitle") || "Get in Touch"}
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
                {t("contact.title") || "Contact Us"}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isRTL ? "arabic-text" : ""}`}
            >
              {t("contact.description") || "We're here to help you on your learning journey"}
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

      {/* Contact Info Cards */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-[var(--border)] text-center hover:shadow-lg transition-shadow"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${info.color}15` }}
                >
                  <info.icon className="w-7 h-7" style={{ color: info.color }} />
                </div>
                <h3 className={`text-[var(--text-primary)] font-bold text-lg mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-[var(--text-muted)] text-sm">
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Quick Contact */}
      <section className="py-16 bg-[var(--background-green)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${isRTL ? "lg:grid-flow-dense" : ""}`}>
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={isRTL ? "lg:col-start-2" : ""}
            >
              <div className="bg-card rounded-3xl p-8 shadow-xl border border-[var(--border)]">
                <h2 className={`text-[var(--text-primary)] text-2xl font-bold mb-6 ${isRTL ? "arabic-text" : ""}`}>
                  {t("contact.sendMessage")}
                </h2>

                {error && (
                  <div className={`mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm ${isRTL ? "text-right arabic-text" : ""}`}>
                    {error}
                  </div>
                )}

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className={`text-[var(--text-primary)] text-xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("contact.messageSent")}
                    </h3>
                    <p className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                      {t("contact.thankYouMessage")}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className={isRTL ? "text-right" : ""}>
                      <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("contact.yourName")} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        placeholder={t("admission.placeholders.fullName")}
                      />
                    </div>

                    <div className={isRTL ? "text-right" : ""}>
                      <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("contact.emailAddress")} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                        placeholder={t("admission.placeholders.email")}
                      />
                    </div>

                    <div className={isRTL ? "text-right" : ""}>
                      <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("contact.subject")} *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                      >
                        <option value="">{t("contact.selectSubject")}</option>
                        <option value="admission">{t("contact.admissionInquiry")}</option>
                        <option value="course">{t("contact.courseQuestion")}</option>
                        <option value="technical">{t("contact.technicalSupport")}</option>
                        <option value="payment">{t("contact.paymentIssue")}</option>
                        <option value="feedback">{t("contact.feedback")}</option>
                        <option value="other">{t("contact.other")}</option>
                      </select>
                    </div>

                    <div className={isRTL ? "text-right" : ""}>
                      <label className={`block text-[var(--text-secondary)] text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("contact.message")} *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none ${isRTL ? "text-right" : ""}`}
                        placeholder={t("contact.requirementsPlaceholder")}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse arabic-text" : ""}`}
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
                  </form>
                )}
              </div>
            </motion.div>

            {/* Quick Contact Options */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`space-y-6 ${isRTL ? "lg:col-start-1" : ""}`}
            >
              {/* WhatsApp Quick Connect */}
              <div className="bg-green-500 rounded-3xl p-8 text-white">
                <div className={`flex items-center gap-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <h3 className={`text-xl font-bold ${isRTL ? "arabic-text" : ""}`}>{t("contact.chatWhatsApp")}</h3>
                    <p className="text-white/80 text-sm">{t("contact.fastestResponse")}</p>
                  </div>
                </div>
                <p className={`text-white/90 mb-6 ${isRTL ? "arabic-text text-right" : ""}`}>
                  {t("contact.whatsAppDesc")}
                </p>
                <a
                  href="https://wa.me/92XXXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <MessageCircle className="w-5 h-5" />
                  {t("contact.startChat")}
                </a>
              </div>

              {/* FAQ Section */}
              <div className="bg-card rounded-3xl p-8 shadow-xl border border-[var(--border)]">
                <h3 className={`text-[var(--text-primary)] text-xl font-bold mb-6 ${isRTL ? "arabic-text" : ""}`}>
                  {t("contact.faq")}
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      q: t("contact.howToStart"),
                      a: t("contact.howToStartAnswer")
                    },
                    {
                      q: t("contact.equipment"),
                      a: t("contact.equipmentAnswer")
                    },
                    {
                      q: t("contact.changeTiming"),
                      a: t("contact.changeTimingAnswer")
                    },
                    {
                      q: t("contact.recorded"),
                      a: t("contact.recordedAnswer")
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-[var(--border)] last:border-0 pb-4 last:pb-0">
                      <h4 className={`text-[var(--text-primary)] font-semibold mb-1 ${isRTL ? "arabic-text" : ""}`}>
                        {faq.q}
                      </h4>
                      <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
