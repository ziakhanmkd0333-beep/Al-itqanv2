"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/contexts/AuthContext";

// Floating particles for background - generated client-side to avoid hydration mismatch
interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

// Inner component that uses useSearchParams
function LoginForm() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in - use useEffect to avoid setState during render
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = searchParams.get('redirect') || `/dashboard/${user.role}`;
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    const result = await login(formData.email, formData.password, formData.rememberMe);

    if (result.success) {
      setSuccess(true);
      // Get the redirect path from URL or default to role-based dashboard
      const redirectPath = searchParams.get('redirect') || `/dashboard/${user?.role || 'student'}`;
      
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/admission-hero.png"
          alt="Login"
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
              <pattern id="login-hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#login-hero-pattern)" />
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="Al-NOOR Academy"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
          </Link>
          <h1 className={`text-white text-2xl font-bold mt-4 ${isRTL ? "arabic-text" : ""}`}>
            {t("login.welcomeBack") || "Welcome Back"}
          </h1>
          <p className={`text-white/80 mt-1 ${isRTL ? "arabic-text" : ""}`}>
            {t("login.signInToContinue") || "Sign in to continue your learning journey"}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-600 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-600 text-sm"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Login successful! Redirecting...</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className={`block text-gray-700 text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("login.email") || "Email Address"}
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? "right-4" : "left-4"}`} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"}`}
                  placeholder={t("login.emailPlaceholder") || "Enter your email"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-gray-700 text-sm font-medium mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("login.password") || "Password"}
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? "right-4" : "left-4"}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "pr-24 pl-4" : "pl-12 pr-12"}`}
                  placeholder={t("login.passwordPlaceholder") || "Enter your password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRTL ? "left-4" : "right-4"}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className={`text-gray-600 text-sm ${isRTL ? "arabic-text" : ""}`}>{t("login.rememberMe") || "Remember me"}</span>
              </label>
              <Link href="/auth/forgot-password" className={`text-[var(--primary)] text-sm hover:underline ${isRTL ? "arabic-text" : ""}`}>
                {t("login.forgotPassword") || "Forgot password?"}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className={isRTL ? "arabic-text" : ""}>{t("login.signingIn") || "Signing in..."}</span>
                </>
              ) : (
                <>
                  <span className={isRTL ? "arabic-text" : ""}>{t("login.signIn") || "Sign In"}</span>
                  <ArrowRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 bg-white text-gray-500 ${isRTL ? "arabic-text" : ""}`}>
                {t("login.orContinueWith") || "Or continue with"}
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className={`text-center text-white/80 mt-6 ${isRTL ? "arabic-text" : ""}`}>
          {t("login.noAccount") || "Don't have an account?"}{" "}
          <Link href="/admission" className="text-[#C9A84C] font-semibold hover:underline">
            {t("login.applyAdmission") || "Apply for Admission"}
          </Link>
        </p>

        {/* Back to Home */}
        <p className="text-center mt-4">
          <Link href="/" className={`text-white/60 text-sm hover:text-white ${isRTL ? "arabic-text flex-row-reverse inline-flex items-center gap-1" : ""}`}>
            {isRTL ? "" : "← "}{t("login.backToHome") || "Back to Home"}{isRTL ? " →" : ""}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary)]">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
