"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Play,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LiveSession {
  id: string;
  title: string;
  description: string;
  course_id: string;
  course_title: string;
  teacher_name: string;
  teacher_photo?: string;
  scheduled_at: string;
  duration: number;
  meeting_url: string;
  meeting_platform: string;
  status: string;
  max_participants: number;
}

export default function StudentLiveClassesPage() {
  return (
    <StudentRoute>
      <LiveClassesContent />
    </StudentRoute>
  );
}

function LiveClassesContent() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student/sessions?userId=${user?.id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load live classes');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchSessions();
    }
  }, [user?.id, fetchSessions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      fullDate: date.toLocaleString()
    };
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const isLive = (dateString: string, duration: number) => {
    const start = new Date(dateString);
    const end = new Date(start.getTime() + duration * 60000);
    const now = new Date();
    return now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="student" />

      <div className="lg:ml-72 min-h-screen">
        <main className="p-4 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Live Classes
            </h1>
            <p className="text-[var(--text-muted)]">
              Join your scheduled live video classes
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Refresh */}
          <div className="mb-6">
            <button
              onClick={fetchSessions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Sessions */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No upcoming live classes</p>
              <p className="text-sm">Check back later for scheduled sessions</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session) => {
                const dateInfo = formatDate(session.scheduled_at);
                const upcoming = isUpcoming(session.scheduled_at);
                const live = isLive(session.scheduled_at, session.duration);

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 bg-[var(--card-background)] rounded-xl border ${
                      live ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20' : 'border-[var(--border)]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Box */}
                      <div className="flex-shrink-0 w-20 h-20 bg-[var(--primary)]/10 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-[var(--primary)]">
                          {new Date(session.scheduled_at).getDate()}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] uppercase">
                          {new Date(session.scheduled_at).toLocaleDateString(undefined, { month: 'short' })}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {live && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                              LIVE NOW
                            </span>
                          )}
                          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                            {dateInfo.time}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                          {session.title}
                        </h3>

                        <div className="flex flex-wrap gap-3 text-sm text-[var(--text-muted)] mb-3">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {session.course_title}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.duration} minutes
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            {session.meeting_platform}
                          </span>
                        </div>

                        {session.teacher_name && (
                          <p className="text-sm text-[var(--text-muted)] mb-4">
                            Instructor: {session.teacher_name}
                          </p>
                        )}

                        {/* Join Button */}
                        <div className="flex gap-3">
                          <a
                            href={session.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                              live
                                ? 'bg-[var(--primary)] text-white hover:opacity-90 animate-pulse'
                                : upcoming
                                ? 'bg-[var(--primary)] text-white hover:opacity-90'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Play className="w-4 h-4" />
                            {live ? 'Join Live Class' : upcoming ? 'Join Meeting' : 'Class Ended'}
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {!live && upcoming && (
                            <span className="text-sm text-[var(--text-muted)] flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Starts in {Math.ceil((new Date(session.scheduled_at).getTime() - Date.now()) / (1000 * 60 * 60))} hours
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
