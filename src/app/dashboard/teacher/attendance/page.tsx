"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Save,
  FileText,
  Upload,
  X,
  RefreshCw,
  Wifi,
  WifiOff,
  Users,
  Search
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useTeacherStudents } from "@/hooks/use-realtime-data";
import { supabaseBrowser, getCurrentUser, getTeacherProfile } from "@/lib/supabase-browser";

// Mock data for attendance
const mockStudents = [
  { id: 1, name: "Ahmed Khan", course: "Noorani Qaida", avatar: "A" },
  { id: 2, name: "Fatima Ali", course: "Quran with Tajweed", avatar: "F" },
  { id: 3, name: "Muhammad Hassan", course: "Hifz-ul-Quran", avatar: "M" },
  { id: 4, name: "Aisha Rahman", course: "Beginner Arabic", avatar: "A" },
  { id: 5, name: "Omar Farooq", course: "Quran with Tajweed", avatar: "O" },
  { id: 6, name: "Zainab Malik", course: "Noorani Qaida", avatar: "Z" },
  { id: 7, name: "Yusuf Ahmed", course: "Intermediate Arabic", avatar: "Y" },
  { id: 8, name: "Sarah Khan", course: "Basic Fiqh", avatar: "S" }
];

const attendanceHistory = [
  { date: "2025-03-13", present: 6, absent: 1, late: 1 },
  { date: "2025-03-12", present: 7, absent: 1, late: 0 },
  { date: "2025-03-11", present: 5, absent: 2, late: 1 },
  { date: "2025-03-10", present: 6, absent: 1, late: 1 },
  { date: "2025-03-09", present: 8, absent: 0, late: 0 }
];

export default function TeacherAttendancePage() {
  return (
    <TeacherRoute>
      <TeacherAttendanceContent />
    </TeacherRoute>
  );
}

function TeacherAttendanceContent() {
  const { t, isRTL } = useTranslation();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState<Record<number, { status: string; notes: string }>>({});
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [sessionNotes, setSessionNotes] = useState("");

  // Get teacher ID from profile on mount
  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      if (user?.id) {
        if (user.role === 'teacher') {
          const profile = await getTeacherProfile(user.id);
          if (profile?.id) {
            setTeacherId(profile.id);
          }
        } else {
          setTeacherId(user.id);
        }
      }
    }
    loadProfile();
  }, []);

  // Use real-time hook for teacher students
  const { students: fetchedStudents, loading, refetch } = useTeacherStudents(teacherId, selectedCourse === "all" ? undefined : selectedCourse);

  // Monitor real-time connection
  useEffect(() => {
    const channel = supabaseBrowser.channel('teacher-attendance-connection');
    
    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  // Use fetched students or fall back to mock data
  const students = fetchedStudents.length > 0 ? fetchedStudents : mockStudents;

  // Get unique courses
  const courses = ["all", ...new Set(students.map((s: any) => s.course || s.courses?.title))];

  // Filter students
  const filteredStudents = students.filter((student: any) => {
    const name = student.name || student.users?.full_name || '';
    const course = student.course || student.courses?.title || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "all" || course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNotesChange = (studentId: number, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes }
    }));
  };

  const handleSaveAttendance = async () => {
    if (!teacherId) {
      alert("Teacher ID not found. Please log in again.");
      return;
    }

    const studentIds = Object.keys(attendance);
    if (studentIds.length === 0) {
      alert("No attendance records to save.");
      return;
    }

    try {
      const attendanceData = studentIds.map(id => {
        const studentId = id; // This is a string from Object.keys
        const student = students.find((s: any) => s.id === studentId || s.id === Number(studentId));
        return {
          student_id: studentId,
          teacher_id: teacherId,
          course_id: student?.course_id || student?.course || students[0]?.course_id,
          date: selectedDate,
          status: attendance[Number(id)].status,
          notes: attendance[Number(id)].notes || null
        };
      });

      const response = await fetch('/api/teacher/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance: attendanceData })
      });

      if (response.ok) {
        alert("Attendance saved successfully!");
      } else {
        const error = await response.json();
        alert("Error: " + (error.error || "Failed to save attendance"));
      }
    } catch (error) {
      console.error("Save attendance error:", error);
      alert("An error occurred while saving attendance.");
    }
  };

  const handleUploadMaterial = (studentId: number) => {
    setSelectedStudentId(studentId);
    setShowMaterialModal(true);
  };

  const getStatusButtonClass = (studentId: number, status: string) => {
    const currentStatus = attendance[studentId]?.status;
    const baseClass = "px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ";
    
    if (currentStatus === status) {
      switch (status) {
        case "present":
          return baseClass + "bg-green-500 text-white shadow-lg";
        case "absent":
          return baseClass + "bg-red-500 text-white shadow-lg";
        case "late":
          return baseClass + "bg-yellow-500 text-white shadow-lg";
      }
    }
    
    return baseClass + "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600";
  };

  // Calendar navigation
  const navigateDate = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    const newDate = new Date(current);
    newDate.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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
              <Calendar className="w-8 h-8 text-emerald-600" />
              Attendance Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Mark attendance and manage session notes for your students
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Object.values(attendance).filter(a => a.status === 'present').length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Present Today</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Object.values(attendance).filter(a => a.status === 'absent').length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Absent Today</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Object.values(attendance).filter(a => a.status === 'late').length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Late Today</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStudents.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Attendance Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date Selector & Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Date Navigation */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigateDate('prev')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                        {formatDate(selectedDate)}
                      </span>
                    </div>
                    <button
                      onClick={() => navigateDate('next')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Search & Filter */}
                  <div className="flex-1 flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
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

              {/* Attendance Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mark Attendance</h2>
                  <button
                    onClick={handleSaveAttendance}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Attendance
                  </button>
                </div>

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
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Notes
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Materials
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
                              <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {student.course}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'present')}
                                className={getStatusButtonClass(student.id, 'present')}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Present
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'absent')}
                                className={getStatusButtonClass(student.id, 'absent')}
                              >
                                <XCircle className="w-4 h-4" />
                                Absent
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'late')}
                                className={getStatusButtonClass(student.id, 'late')}
                              >
                                <Clock className="w-4 h-4" />
                                Late
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              placeholder="Add notes..."
                              value={attendance[student.id]?.notes || ''}
                              onChange={(e) => handleNotesChange(student.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleUploadMaterial(student.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                              title="Upload Materials"
                            >
                              <Upload className="w-5 h-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredStudents.length === 0 && (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No students found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Attendance History */}
            <div className="space-y-6">
              {/* Recent History */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Recent History
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {attendanceHistory.map((record, index) => (
                    <motion.div
                      key={record.date}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{record.present}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{record.absent}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{record.late}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-emerald-600 rounded-xl p-6 text-white">
                <h2 className="text-lg font-bold mb-4">This Week</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Classes Conducted</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Avg Attendance</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Materials Uploaded</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Notes Written</span>
                    <span className="font-bold">15</span>
                  </div>
                </div>
              </div>

              {/* Session Notes */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Session Notes
                  </h2>
                </div>
                <div className="p-4">
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Write general session notes here..."
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                  <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    <Save className="w-4 h-4" />
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Material Upload Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Session Material</h2>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">Drag and drop files here</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">or</p>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Browse Files
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Supported formats: PDF, DOC, DOCX, MP3, MP4 (Max 50MB)
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowMaterialModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowMaterialModal(false);
                    alert("Material uploaded successfully!");
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
