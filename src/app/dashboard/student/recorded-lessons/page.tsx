"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import {
  PlayCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Play,
  CheckCircle,
  ChevronLeft,
  Eye,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface RecordedLesson {
  id: string;
  title: string;
  description: string;
  course_id: string;
  course_title: string;
  teacher_name: string;
  teacher_photo?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  file_format: string;
  is_free_preview: boolean;
  views_count: number;
  progress: {
    percent: number;
    last_position: number;
    is_completed: boolean;
  } | null;
  created_at: string;
}

export default function StudentRecordedLessonsPage() {
  return (
    <StudentRoute>
      <RecordedLessonsContent />
    </StudentRoute>
  );
}

function RecordedLessonsContent() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<RecordedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<RecordedLesson | null>(null);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student/lessons?userId=${user?.id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }

      const data = await response.json();
      setLessons(data.lessons || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load recorded lessons');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchLessons();
    }
  }, [user?.id, fetchLessons]);

  const updateProgress = async (lessonId: string, progressPercent: number, lastPosition: number, isCompleted: boolean) => {
    try {
      await fetch(`/api/student/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          progress_percent: progressPercent,
          last_position: lastPosition,
          is_completed: isCompleted
        })
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return date.toLocaleDateString();
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
            {selectedLesson ? (
              <button
                onClick={() => setSelectedLesson(null)}
                className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Lessons
              </button>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                  Recorded Lessons
                </h1>
                <p className="text-[var(--text-muted)]">
                  Watch your course video lessons anytime
                </p>
              </>
            )}
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

          {selectedLesson ? (
            /* Video Player View */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  src={selectedLesson.video_url}
                  poster={selectedLesson.thumbnail_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                  onTimeUpdate={(e) => {
                    const video = e.target as HTMLVideoElement;
                    const progressPercent = Math.round((video.currentTime / video.duration) * 100);
                    const isCompleted = progressPercent >= 95;
                    
                    // Throttle updates (every 10 seconds or on completion)
                    if (Math.round(video.currentTime) % 10 === 0 || isCompleted) {
                      updateProgress(
                        selectedLesson.id,
                        progressPercent,
                        Math.round(video.currentTime),
                        isCompleted
                      );
                    }
                  }}
                  onEnded={() => {
                    updateProgress(selectedLesson.id, 100, 0, true);
                  }}
                />
              </div>

              {/* Lesson Info */}
              <div className="bg-[var(--card-background)] rounded-xl p-6 border border-[var(--border)]">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {selectedLesson.title}
                </h2>
                
                <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] mb-4">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {selectedLesson.course_title}
                  </span>
                  {selectedLesson.teacher_name && (
                    <span>Instructor: {selectedLesson.teacher_name}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(selectedLesson.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedLesson.views_count} views
                  </span>
                </div>

                {selectedLesson.description && (
                  <p className="text-[var(--text-primary)]">
                    {selectedLesson.description}
                  </p>
                )}

                {selectedLesson.progress?.is_completed && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    You have completed this lesson
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Lessons List View */
            <>
              {/* Refresh */}
              <div className="mb-6">
                <button
                  onClick={fetchLessons}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Lessons Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-muted)]">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No recorded lessons available</p>
                  <p className="text-sm">Check back later for new content</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lessons.map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedLesson(lesson)}
                      className="cursor-pointer group"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-[var(--background)] rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--primary)] transition-colors">
                        {lesson.thumbnail_url ? (
                          <Image
                            src={lesson.thumbnail_url}
                            alt={lesson.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10">
                            <PlayCircle className="w-12 h-12 text-[var(--primary)]/50" />
                          </div>
                        )}

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        {lesson.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            {formatDuration(lesson.duration)}
                          </div>
                        )}

                        {/* Progress Bar */}
                        {lesson.progress && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                            <div
                              className="h-full bg-[var(--primary)]"
                              style={{ width: `${lesson.progress.percent}%` }}
                            />
                          </div>
                        )}

                        {/* Completed Badge */}
                        {lesson.progress?.is_completed && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="mt-3">
                        <h3 className="font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                          {lesson.course_title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-2">
                          <span>{formatTimeAgo(lesson.created_at)}</span>
                          <span>•</span>
                          <span>{lesson.views_count} views</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
