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
  Wifi,
  WifiOff,
  ArrowRight,
  User,
  Award,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useStudentDashboard } from "@/hooks/use-realtime-data";
import { supabaseBrowser, getCurrentUser } from "@/lib/supabase-browser";

// Mock data for student courses
const enrolledCourses = [
  {
    id: 1,
    title: "Noorani Qaida",
    description: "Learn Arabic alphabet and basic Quran reading",
    teacher: "Dr. Noor Ur Rahman",
    progress: 75,
    totalLessons: 30,
    completedLessons: 22,
    nextCourse: "Nazra Quran",
    category: "Quran",
    level: "Beginner",
    lessons: [
      { id: 1, title: "Introduction to Arabic Letters", duration: "15 min", completed: true, type: "video" },
      { id: 2, title: "Alif to Jeem", duration: "20 min", completed: true, type: "video" },
      { id: 3, title: "Haa to Khaa", duration: "18 min", completed: true, type: "video" },
      { id: 4, title: "Practice Session 1", duration: "30 min", completed: true, type: "practice" },
      { id: 5, title: "Daal to Raa", duration: "22 min", completed: true, type: "video" },
      { id: 6, title: "Zaay to Seen", duration: "20 min", completed: true, type: "video" },
      { id: 7, title: "Sheen to Taw", duration: "25 min", completed: false, type: "video" },
      { id: 8, title: "Joining Letters", duration: "30 min", completed: false, type: "video" }
    ],
    materials: [
      { id: 1, title: "Noorani Qaida PDF", type: "pdf", size: "2.5 MB" },
      { id: 2, title: "Practice Worksheets", type: "pdf", size: "1.2 MB" },
      { id: 3, title: "Audio Practice Files", type: "audio", size: "15 MB" }
    ],
    recordings: [
      { id: 1, title: "Session 1 - Introduction", date: "2025-03-01", duration: "30 min" },
      { id: 2, title: "Session 2 - Letters Practice", date: "2025-03-03", duration: "30 min" },
      { id: 3, title: "Session 3 - Joining Letters", date: "2025-03-05", duration: "35 min" }
    ]
  },
  {
    id: 2,
    title: "Quran with Tajweed",
    description: "Master Quran recitation with proper Tajweed rules",
    teacher: "Sheikh Ahmad Ali",
    progress: 45,
    totalLessons: 40,
    completedLessons: 18,
    nextCourse: "Advanced Tajweed",
    category: "Quran",
    level: "Intermediate",
    lessons: [
      { id: 1, title: "Introduction to Tajweed", duration: "25 min", completed: true, type: "video" },
      { id: 2, title: "Makharij - Articulation Points", duration: "30 min", completed: true, type: "video" },
      { id: 3, title: "Sifaat - Letter Attributes", duration: "28 min", completed: true, type: "video" },
      { id: 4, title: "Noon Sakinah Rules", duration: "35 min", completed: true, type: "video" },
      { id: 5, title: "Meem Sakinah Rules", duration: "30 min", completed: false, type: "video" },
      { id: 6, title: "Madd Rules", duration: "40 min", completed: false, type: "video" }
    ],
    materials: [
      { id: 1, title: "Tajweed Rules Guide", type: "pdf", size: "5 MB" },
      { id: 2, title: "Makharij Chart", type: "pdf", size: "1 MB" }
    ],
    recordings: [
      { id: 1, title: "Tajweed Practice Session", date: "2025-03-10", duration: "45 min" }
    ]
  }
];

const progressionPath = [
  { course: "Noorani Qaida", status: "completed" },
  { course: "Nazra Quran", status: "current" },
  { course: "Quran with Tajweed", status: "in_progress" },
  { course: "Advanced Tajweed", status: "locked" },
  { course: "Hifz-ul-Quran", status: "locked" }
];

export default function StudentCoursesPage() {
  return (
    <StudentRoute>
      <StudentCoursesContent />
    </StudentRoute>
  );
}

function StudentCoursesContent() {
  const { t, isRTL } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState(enrolledCourses[0]);
  const [activeTab, setActiveTab] = useState<"lessons" | "materials" | "recordings">("lessons");

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "current":
        return <Play className="w-5 h-5 text-emerald-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

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
              {enrolledCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCourse(course)}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-4 border cursor-pointer transition-all ${
                    selectedCourse.id === course.id
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
              ))}
            </div>

            {/* Course Details */}
            <div className="lg:col-span-2">
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
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
