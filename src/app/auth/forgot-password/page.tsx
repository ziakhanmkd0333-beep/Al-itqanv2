"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { isRTL } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || "Failed to send reset email");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl p-8 shadow-xl border border-[var(--border)]"
          >
            {!isSuccess ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[var(--primary)]" />
                  </div>
                  <h1 className={`text-2xl font-bold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {isRTL ? "پاس ورڈ بھول گئے؟" : "Forgot Password?"}
                  </h1>
                  <p className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                    {isRTL 
                      ? "اپنا ای میل ایڈریس درج کریں اور ہم آپ کو پاس ورڈ ری سیٹ کرنے کا لنک بھیجیں گے۔" 
                      : "Enter your email address and we'll send you a link to reset your password."}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {isRTL ? "ای میل ایڈریس" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                      placeholder={isRTL ? "اپنا ای میل درج کریں" : "Enter your email"}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isRTL ? "بھیجا جا رہا ہے..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        {isRTL ? "ری سیٹ لنک بھیجیں" : "Send Reset Link"}
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/auth/login"
                    className={`inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {isRTL ? "لاگ ان پر واپس جائیں" : "Back to Login"}
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </motion.div>
                
                <h2 className={`text-2xl font-bold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {isRTL ? "ای میل بھیج دی گئی!" : "Email Sent!"}
                </h2>
                <p className={`text-[var(--text-secondary)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                  {isRTL 
                    ? `ہم نے ${email} پر پاس ورڈ ری سیٹ کرنے کا لنک بھیج دیا ہے۔ براہ کرم اپنا انباکس چیک کریں۔` 
                    : `We've sent a password reset link to ${email}. Please check your inbox.`}
                </p>

                <div className="space-y-3">
                  <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                    {isRTL ? "ای میل نہیں ملا؟" : "Didn't receive the email?"}
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className={`text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors ${isRTL ? "arabic-text" : ""}`}
                  >
                    {isRTL ? "دوبارہ کوشش کریں" : "Try again"}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <Link
                    href="/auth/login"
                    className={`inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {isRTL ? "لاگ ان پر واپس جائیں" : "Back to Login"}
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
