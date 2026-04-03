"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import { Calendar, Clock, BookOpen, Video, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useStudentDashboard } from "@/hooks/use-realtime-data";
import { getCurrentUser, getStudentProfile } from "@/lib/supabase-browser";

export default function StudentSchedulePage() {
  return (
    <StudentRoute>
      <StudentScheduleContent />
    </StudentRoute>
  );
}

function StudentScheduleContent() {
  const { t, isRTL } = useTranslation();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get student ID from profile on mount
  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      if (user?.id) {
        if (user.role === 'student' || !user.role) {
          const profile = await getStudentProfile(user.id);
          if (profile?.id) {
            setStudentId(profile.id);
          }
        } else {
          setStudentId(user.id);
        }
      }
    }
    loadProfile();
  }, []);

  // Use real-time hook for student dashboard data
  const { upcomingSessions, loading } = useStudentDashboard(studentId);

  // Group sessions by date
  const sessionsByDate = upcomingSessions.reduce((acc: Record<string, { id: string; date: string; scheduled_at: string; course_title: string; course: string; time: string; duration: string; teacher_name: string }[]>, session: { id: string; date: string; scheduled_at: string; course_title: string; course: string; time: string; duration: string; teacher_name: string }) => {
    const date = new Date(session.date || session.scheduled_at).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <DashboardSidebar userType="student" />
        <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        </main>
      </div>
    );
  }

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
            {t("sidebar.schedule") || "Schedule"}
          </h1>
          <p className="text-[var(--text-muted)]">
            View your upcoming classes and sessions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-lg border border-[var(--border)]"
        >
          {upcomingSessions.length > 0 ? (
            <div className="space-y-6">
              {/* Weekly Calendar View */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map((day, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() - date.getDay() + index);
                  const isToday = index === today.getDay();
                  const hasSessions = sessionsByDate[date.toDateString()];
                  
                  return (
                    <div 
                      key={day} 
                      className={`text-center p-3 rounded-xl border ${
                        isToday 
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                          : 'bg-[var(--background)] border-[var(--border)]'
                      } ${hasSessions ? 'ring-2 ring-[var(--gold)]' : ''}`}
                    >
                      <p className="text-xs opacity-80">{day}</p>
                      <p className="text-lg font-bold">{date.getDate()}</p>
                      {hasSessions && (
                        <div className="w-2 h-2 bg-[var(--gold)] rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sessions List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--primary)]" />
                  Upcoming Sessions ({upcomingSessions.length})
                </h3>
                {upcomingSessions.map((session: any, index: number) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)]">{session.course_title || session.course}</h4>
                      <p className="text-sm text-[var(--text-muted)]">
                        {new Date(session.date || session.scheduled_at).toLocaleDateString()} • {session.time || 'TBD'} ({session.duration || '30 min'})
                      </p>
                      {session.teacher_name && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          with {session.teacher_name}
                        </p>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm hover:bg-[var(--primary-dark)] transition-colors">
                      Join
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  No Upcoming Sessions
                </h3>
                <p className="text-[var(--text-muted)] max-w-md">
                  Your class schedule will be displayed here once you are enrolled in courses. 
                  Please check back later or contact your teacher for schedule details.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
