"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";

function ResetPasswordContent() {
  const { isRTL } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Invalid reset link. Please request a new password reset.");
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(isRTL ? "پاس ورڈ میچ نہیں کر رہے" : "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError(isRTL ? "پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے" : "Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password");
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
                    <Lock className="w-8 h-8 text-[var(--primary)]" />
                  </div>
                  <h1 className={`text-2xl font-bold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {isRTL ? "نیا پاس ورڈ سیٹ کریں" : "Set New Password"}
                  </h1>
                  <p className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                    {isRTL ? "اپنا نیا پاس ورڈ درج کریں" : "Enter your new password below"}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  </div>
                )}

                {tokenValid === false ? (
                  <div className="text-center">
                    <p className="text-[var(--text-secondary)] mb-4">
                      {isRTL ? "یہ لنک ختم ہو چکا ہے یا غلط ہے۔" : "This reset link is invalid or has expired."}
                    </p>
                    <Link
                      href="/auth/forgot-password"
                      className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                    >
                      {isRTL ? "نیا لنک حاصل کریں" : "Get a new reset link"}
                    </Link>
                  </div>
                ) : tokenValid ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {isRTL ? "نیا پاس ورڈ" : "New Password"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full px-4 py-3 pr-12 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                          placeholder={isRTL ? "نیا پاس ورڈ درج کریں" : "Enter new password"}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {isRTL ? "پاس ورڈ کی تصدیق" : "Confirm Password"}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full px-4 py-3 pr-12 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                          placeholder={isRTL ? "پاس ورڈ دوبارہ درج کریں" : "Confirm new password"}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {isRTL ? "سیٹ ہو رہا ہے..." : "Resetting..."}
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          {isRTL ? "پاس ورڈ سیٹ کریں" : "Reset Password"}
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                  </div>
                )}
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
                  {isRTL ? "پاس ورڈ بدل دیا گیا!" : "Password Reset!"}
                </h2>
                <p className={`text-[var(--text-secondary)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                  {isRTL 
                    ? "آپ کا پاس ورڈ کامیابی سے بدل دیا گیا ہے۔ آپ کو لاگ ان صفحے پر بھیج دیا جائے گا۔" 
                    : "Your password has been reset successfully. Redirecting to login..."}
                </p>

                <Link
                  href="/auth/login"
                  className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                >
                  {isRTL ? "لاگ ان پر جائیں" : "Go to Login"}
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <Navbar />
        <section className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        </section>
        <Footer />
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
