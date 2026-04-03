"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Wifi,
  WifiOff,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useStudentAttendance } from "@/hooks/use-realtime-data";
import { getCurrentUser, getStudentProfile } from "@/lib/supabase-browser";

export default function StudentAttendancePage() {
  return (
    <StudentRoute>
      <StudentAttendanceContent />
    </StudentRoute>
  );
}

function StudentAttendanceContent() {
  const { t, isRTL } = useTranslation();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

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

  // Use real-time hook for attendance data
  const { records: attendanceRecords, loading } = useStudentAttendance(studentId);

  // Get unique courses from records
  const courses = ["all", ...new Set(attendanceRecords.map(r => r.course_title || r.course).filter(Boolean))];

  // Filter records
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesCourse = selectedCourse === "all" || (record.course_title || record.course) === selectedCourse;
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    return matchesCourse && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "late":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "absent":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "late":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  // Calculate stats from real data
  const totalPresent = attendanceRecords.filter(r => r.status === "present").length;
  const totalAbsent = attendanceRecords.filter(r => r.status === "absent").length;
  const totalLate = attendanceRecords.filter(r => r.status === "late").length;
  const attendanceRate = attendanceRecords.length > 0 ? Math.round((totalPresent / attendanceRecords.length) * 100) : 0;

  // Calculate monthly stats from records
  const monthlyStatsMap = attendanceRecords.reduce((acc: Record<string, Record<string, unknown>>, record: Record<string, unknown>) => {
    const month = new Date(record.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, present: 0, absent: 0, late: 0, total: 0 };
    }
    acc[month][record.status]++;
    acc[month].total++;
    return acc;
  }, {});
  const monthlyStats = Object.values(monthlyStatsMap).slice(0, 3);

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
              <Calendar className="w-8 h-8 text-emerald-600" />
              Attendance History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View your attendance records and track your class participation
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPresent}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Present</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAbsent}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Absent</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLate}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Late</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceRate}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Records */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {courses.map(course => (
                        <option key={course} value={course}>
                          {course === "all" ? "All Courses" : course}
                        </option>
                      ))}
                    </select>
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>

              {/* Records Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredRecords.map((record, index) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900 dark:text-white">
                                {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-emerald-500" />
                              <span className="text-gray-900 dark:text-white">{record.course}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                            {record.teacher}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(record.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(record.status)}`}>
                                {record.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                            {record.notes || "-"}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredRecords.length === 0 && (
                  <div className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No attendance records found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Monthly Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Summary</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {monthlyStats.map((stat, index) => (
                    <motion.div
                      key={stat.month}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <p className="font-medium text-gray-900 dark:text-white mb-2">{stat.month}</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <p className="font-bold text-green-600">{stat.present}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Present</p>
                        </div>
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                          <p className="font-bold text-red-600">{stat.absent}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Absent</p>
                        </div>
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                          <p className="font-bold text-yellow-600">{stat.late}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Late</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Attendance Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Breakdown</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Present</span>
                      <span className="font-medium text-green-600">{Math.round((totalPresent / attendanceRecords.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(totalPresent / attendanceRecords.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Absent</span>
                      <span className="font-medium text-red-600">{Math.round((totalAbsent / attendanceRecords.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${(totalAbsent / attendanceRecords.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Late</span>
                      <span className="font-medium text-yellow-600">{Math.round((totalLate / attendanceRecords.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(totalLate / attendanceRecords.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-emerald-600 rounded-xl p-6 text-white">
                <h2 className="text-lg font-bold mb-3">Attendance Tips</h2>
                <ul className="space-y-2 text-sm text-white/90">
                  <li>• Maintain at least 90% attendance for best results</li>
                  <li>• Notify your teacher in advance if you'll be absent</li>
                  <li>• Join classes on time to maximize learning</li>
                  <li>• Review recorded sessions if you miss a class</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
