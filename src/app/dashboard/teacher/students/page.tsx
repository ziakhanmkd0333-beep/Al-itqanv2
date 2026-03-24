"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  ChevronRight,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  X,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useTeacherStudents } from "@/hooks/use-realtime-data";
import { supabaseBrowser, getCurrentUser } from "@/lib/supabase-browser";

// Mock data for teacher's students
const mockStudents = [
  {
    id: 1,
    name: "Ahmed Khan",
    email: "ahmed.khan@email.com",
    phone: "+1-234-567-8901",
    course: "Noorani Qaida",
    progress: 75,
    lastSession: "2025-03-13",
    nextSession: "2025-03-15 10:00 AM",
    attendance: { present: 12, absent: 2, late: 1 },
    status: "active",
    avatar: "A"
  },
  {
    id: 2,
    name: "Fatima Ali",
    email: "fatima.ali@email.com",
    phone: "+1-234-567-8902",
    course: "Quran with Tajweed",
    progress: 45,
    lastSession: "2025-03-12",
    nextSession: "2025-03-14 11:30 AM",
    attendance: { present: 15, absent: 0, late: 1 },
    status: "active",
    avatar: "F"
  },
  {
    id: 3,
    name: "Muhammad Hassan",
    email: "muhammad.hassan@email.com",
    phone: "+1-234-567-8903",
    course: "Hifz-ul-Quran",
    progress: 60,
    lastSession: "2025-03-10",
    nextSession: "2025-03-14 2:00 PM",
    attendance: { present: 10, absent: 3, late: 0 },
    status: "active",
    avatar: "M"
  },
  {
    id: 4,
    name: "Aisha Rahman",
    email: "aisha.rahman@email.com",
    phone: "+1-234-567-8904",
    course: "Beginner Arabic",
    progress: 30,
    lastSession: "2025-03-06",
    nextSession: "2025-03-15 3:30 PM",
    attendance: { present: 8, absent: 4, late: 2 },
    status: "needs_attention",
    avatar: "A"
  },
  {
    id: 5,
    name: "Omar Farooq",
    email: "omar.farooq@email.com",
    phone: "+1-234-567-8905",
    course: "Quran with Tajweed",
    progress: 85,
    lastSession: "2025-03-13",
    nextSession: "2025-03-15 4:00 PM",
    attendance: { present: 14, absent: 1, late: 0 },
    status: "active",
    avatar: "O"
  },
  {
    id: 6,
    name: "Zainab Malik",
    email: "zainab.malik@email.com",
    phone: "+1-234-567-8906",
    course: "Noorani Qaida",
    progress: 50,
    lastSession: "2025-03-11",
    nextSession: "2025-03-14 5:00 PM",
    attendance: { present: 11, absent: 2, late: 1 },
    status: "active",
    avatar: "Z"
  },
  {
    id: 7,
    name: "Yusuf Ahmed",
    email: "yusuf.ahmed@email.com",
    phone: "+1-234-567-8907",
    course: "Intermediate Arabic",
    progress: 65,
    lastSession: "2025-03-12",
    nextSession: "2025-03-15 6:00 PM",
    attendance: { present: 13, absent: 1, late: 0 },
    status: "active",
    avatar: "Y"
  },
  {
    id: 8,
    name: "Sarah Khan",
    email: "sarah.khan@email.com",
    phone: "+1-234-567-8908",
    course: "Basic Fiqh",
    progress: 40,
    lastSession: "2025-03-09",
    nextSession: "2025-03-16 10:00 AM",
    attendance: { present: 9, absent: 3, late: 1 },
    status: "active",
    avatar: "S"
  }
];

export default function TeacherStudentsPage() {
  return (
    <TeacherRoute>
      <TeacherStudentsContent />
    </TeacherRoute>
  );
}

function TeacherStudentsContent() {
  const { t, isRTL } = useTranslation();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Get teacher ID from localStorage on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user?.id) {
      setTeacherId(user.id);
    } else {
      // Demo teacher ID for development
      setTeacherId('demo-teacher-1');
    }
  }, []);

  // Use real-time hook for teacher students
  const { students: fetchedStudents, loading, refetch } = useTeacherStudents(teacherId, selectedCourse === "all" ? undefined : selectedCourse);

  // Monitor real-time connection
  useEffect(() => {
    const channel = supabaseBrowser.channel('teacher-students-connection');
    
    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  // Use fetched students or fall back to mock data
  const students = fetchedStudents.length > 0 ? fetchedStudents : mockStudents;

  // Get unique courses for filter
  const courses = ["all", ...new Set(students.map((s: any) => s.course || s.courses?.title))];

  // Filter students
  const filteredStudents = students.filter((student: any) => {
    const name = student.name || student.users?.full_name || '';
    const email = student.email || student.users?.email || '';
    const course = student.course || student.courses?.title || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "all" || course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "needs_attention":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleViewStudent = (student: typeof mockStudents[0]) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar userType="teacher" />

      <main className={`p-6 ${isRTL ? "mr-64" : "ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-600" />
              My Students
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage your assigned students
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStudents.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length - 1}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">56%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sessions Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
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
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{student.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {student.course}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(student.progress)} rounded-full transition-all`}
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {student.lastSession}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400 text-sm">{student.attendance.present}P</span>
                          <span className="text-red-600 dark:text-red-400 text-sm">{student.attendance.absent}A</span>
                          <span className="text-yellow-600 dark:text-yellow-400 text-sm">{student.attendance.late}L</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <a
                            href={`mailto:${student.email}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-5 h-5" />
                          </a>
                          <a
                            href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No students found matching your criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Student Detail Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Details</h2>
              <button
                onClick={() => setShowStudentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Student Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="text-2xl text-emerald-600 dark:text-emerald-400 font-bold">{selectedStudent.avatar}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedStudent.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedStudent.status)}`}>
                    {selectedStudent.status === "active" ? "Active" : "Needs Attention"}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-gray-900 dark:text-white">{selectedStudent.email}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                  <p className="text-gray-900 dark:text-white">{selectedStudent.phone}</p>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled Course</p>
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {selectedStudent.course}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedStudent.progress}%</p>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(selectedStudent.progress)} rounded-full`}
                      style={{ width: `${selectedStudent.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Session Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Session</p>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedStudent.lastSession}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next Session</p>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedStudent.nextSession}</p>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Attendance Summary</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Present: {selectedStudent.attendance.present}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Absent: {selectedStudent.attendance.absent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Late: {selectedStudent.attendance.late}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedStudent.email}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </a>
                <a
                  href={`https://wa.me/${selectedStudent.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
