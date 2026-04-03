"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  ChevronRight,
  FileText,
  Video,
  Download,
  RefreshCw,
  ArrowRight,
  User,
  Award,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useStudentDashboard } from "@/hooks/use-realtime-data";
import { getCurrentUser, getStudentProfile } from "@/lib/supabase-browser";

export default function StudentCoursesPage() {
  return (
    <StudentRoute>
      <StudentCoursesContent />
    </StudentRoute>
  );
}

function StudentCoursesContent() {
  const { t, isRTL } = useTranslation();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"lessons" | "materials" | "recordings">("lessons");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

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
  const { enrollments, loading } = useStudentDashboard(studentId);

  // Set first course as selected when data loads
  useEffect(() => {
    if (enrollments.length > 0 && !selectedCourse) {
      setSelectedCourse(enrollments[0]);
    }
  }, [enrollments, selectedCourse]);

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardSidebar userType="student" />
        <main className={`p-6 ${isRTL ? "mr-64" : "ml-64"}`}>
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        </main>
      </div>
    );
  }

  // Transform enrollment data to match expected format
  const enrolledCourses = enrollments.map((enrollment: any) => ({
    id: enrollment.id,
    title: enrollment.course_title || enrollment.course?.title || 'Course',
    description: enrollment.course?.description || 'Course description',
    teacher: enrollment.teacher_name || enrollment.teacher?.full_name || 'Assigned Teacher',
    progress: enrollment.progress || 0,
    totalLessons: enrollment.total_lessons || 0,
    completedLessons: enrollment.completed_lessons || 0,
    nextCourse: enrollment.next_course || 'Next Level',
    category: enrollment.course?.category || 'Quran',
    level: enrollment.course?.level || 'Beginner',
    course: enrollment.course
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar userType="student" />

      <main className={`p-6 ${isRTL ? "mr-64" : "ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              My Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Access your enrolled courses, lessons, and materials
            </p>
          </div>

          {/* Progression Path */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-emerald-600" />
              Your Learning Path
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {progressionPath.map((item, index) => (
                <div key={item.course} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    item.status === "completed" ? "bg-green-100 dark:bg-green-900/30" :
                    item.status === "current" ? "bg-emerald-100 dark:bg-emerald-900/30 ring-2 ring-emerald-500" :
                    item.status === "in_progress" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                    "bg-gray-100 dark:bg-gray-700"
                  }`}>
                    {getStatusIcon(item.status)}
                    <span className={`text-sm font-medium ${
                      item.status === "locked" ? "text-gray-400" : "text-gray-700 dark:text-gray-300"
                    }`}>{item.course}</span>
                  </div>
                  {index < progressionPath.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enrolled Courses</h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                </div>
              ) : enrolledCourses.length > 0 ? (
                enrolledCourses.map((course: any, index: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedCourse(course)}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 border cursor-pointer transition-all ${
                      selectedCourse?.id === course.id
                        ? "border-emerald-500 ring-2 ring-emerald-500/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{course.category} • {course.level}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        course.progress >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        course.progress >= 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(course.progress)} rounded-full transition-all`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {course.completedLessons}/{course.totalLessons} lessons completed
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No courses enrolled yet</p>
                  <Link href="/courses" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">
                    Browse courses
                  </Link>
                </div>
              )}
            </div>

            {/* Course Details */}
            <div className="lg:col-span-2">
              {selectedCourse ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Course Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedCourse.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedCourse.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          {selectedCourse.teacher}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {selectedCourse.totalLessons} lessons
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-600">{selectedCourse.progress}%</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Complete</p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex">
                    {[
                      { id: "lessons", label: "Lessons", icon: Play },
                      { id: "materials", label: "Materials", icon: FileText },
                      { id: "recordings", label: "Recordings", icon: Video }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                          activeTab === tab.id
                            ? "text-emerald-600 border-b-2 border-emerald-600"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Lessons Tab */}
                  {activeTab === "lessons" && (
                    <div className="space-y-3">
                      {selectedCourse.lessons.map((lesson, index) => (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            lesson.completed
                              ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                              : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              lesson.completed
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-gray-200 dark:bg-gray-600"
                            }`}>
                              {lesson.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Play className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {lesson.duration} • {lesson.type}
                              </p>
                            </div>
                          </div>
                          <button className={`px-4 py-2 rounded-lg font-medium ${
                            lesson.completed
                              ? "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                          }`}>
                            {lesson.completed ? "Review" : "Start"}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Materials Tab */}
                  {activeTab === "materials" && (
                    <div className="space-y-3">
                      {selectedCourse.materials.map((material, index) => (
                        <motion.div
                          key={material.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              material.type === "pdf" ? "bg-red-100 dark:bg-red-900/30" :
                              material.type === "audio" ? "bg-purple-100 dark:bg-purple-900/30" :
                              "bg-blue-100 dark:bg-blue-900/30"
                            }`}>
                              <FileText className={`w-5 h-5 ${
                                material.type === "pdf" ? "text-red-600" :
                                material.type === "audio" ? "text-purple-600" :
                                "text-blue-600"
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{material.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{material.size}</p>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Recordings Tab */}
                  {activeTab === "recordings" && (
                    <div className="space-y-3">
                      {selectedCourse.recordings.map((recording, index) => (
                        <motion.div
                          key={recording.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Video className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{recording.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {recording.date} • {recording.duration}
                              </p>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Play className="w-4 h-4" />
                            Watch
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Next Course Recommendation */}
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Recommended Next Course</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{selectedCourse.nextCourse}</p>
                      </div>
                    </div>
                    <Link
                      href="/courses"
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      View Course
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Course</h3>
                  <p className="text-gray-500 dark:text-gray-400">Choose a course from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
