"use client";

import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import { TrendingUp, BarChart3, Award } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function StudentProgressPage() {
  return (
    <StudentRoute>
      <StudentProgressContent />
    </StudentRoute>
  );
}

function StudentProgressContent() {
  const { t, isRTL } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="student" />
      
      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
            {t("sidebar.progress") || "My Progress"}
          </h1>
          <p className="text-[var(--text-muted)]">
            Track your learning journey and achievements
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-lg border border-[var(--border)]"
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Progress Tracking Coming Soon
              </h3>
              <p className="text-[var(--text-muted)] max-w-md">
                Your detailed progress reports and analytics will be available here. 
                This feature is currently under development.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
