"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import {
  Users,
  BookOpen,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  GraduationCap,
  X
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface Student {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
}

interface Course {
  id: string;
  title: string;
  teacher_name?: string;
  student_count?: number;
}

interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  student_name: string;
  course_title: string;
  status: string;
  enrolled_at: string;
}

export default function AssignmentsPage() {
  return (
    <AdminRoute>
      <AssignmentsContent />
    </AdminRoute>
  );
}

function AssignmentsContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'enrollments'>('students');
  
  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modal states
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  
  // Search
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch students
      const studentsRes = await fetch('/api/admin/students?status=active', { credentials: 'include' });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);
      }
      
      // Fetch courses
      const coursesRes = await fetch('/api/admin/courses', { credentials: 'include' });
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }
      
      // Fetch enrollments
      const enrollmentsRes = await fetch('/api/admin/enrollments', { credentials: 'include' });
      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json();
        setEnrollments(enrollmentsData.enrollments || []);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedStudent || selectedCourses.length === 0) return;
    
    setProcessing(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          student_id: selectedStudent.id,
          course_ids: selectedCourses
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to enroll student');
      }
      
      setSuccess(`Successfully enrolled ${selectedStudent.full_name} in ${selectedCourses.length} course(s)`);
      setShowEnrollModal(false);
      setSelectedStudent(null);
      setSelectedCourses([]);
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to enroll');
    } finally {
      setProcessing(false);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to remove this enrollment?')) return;
    
    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove enrollment');
      }
      
      setSuccess('Enrollment removed successfully');
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove enrollment');
    } finally {
      setProcessing(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEnrollments = enrollments.filter(e =>
    e.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.course_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar isAdmin />
      
      <div className="lg:ml-72 min-h-screen">
        <main className="p-4 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Course Assignments
            </h1>
            <p className="text-[var(--text-muted)]">
              Manage student enrollments and course assignments
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-[var(--border)]">
            {[
              { id: 'students', label: 'Students', icon: Users },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'enrollments', label: 'Enrollments', icon: GraduationCap },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Alerts */}
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
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              {success}
            </motion.div>
          )}

          {/* Search Bar */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : (
            <>
              {/* Students Tab */}
              {activeTab === 'students' && (
                <div className="grid gap-4">
                  {filteredStudents.map(student => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[var(--card-background)] rounded-xl border border-[var(--border)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">{student.full_name}</h3>
                          <p className="text-sm text-[var(--text-muted)]">{student.email}</p>
                          {student.country && (
                            <p className="text-xs text-[var(--text-muted)]">{student.country}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowEnrollModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-4 h-4" />
                        Assign Course
                      </button>
                    </motion.div>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                      No students found
                    </div>
                  )}
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div className="grid gap-4">
                  {courses.map(course => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[var(--card-background)] rounded-xl border border-[var(--border)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-[var(--secondary)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">{course.title}</h3>
                          {course.teacher_name && (
                            <p className="text-sm text-[var(--text-muted)]">Teacher: {course.teacher_name}</p>
                          )}
                          <p className="text-xs text-[var(--text-muted)]">
                            {course.student_count || 0} students enrolled
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {courses.length === 0 && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                      No courses available
                    </div>
                  )}
                </div>
              )}

              {/* Enrollments Tab */}
              {activeTab === 'enrollments' && (
                <div className="grid gap-4">
                  {filteredEnrollments.map(enrollment => (
                    <motion.div
                      key={enrollment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[var(--card-background)] rounded-xl border border-[var(--border)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">{enrollment.student_name}</h3>
                          <p className="text-sm text-[var(--text-muted)]">{enrollment.course_title}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnenroll(enrollment.id)}
                        disabled={processing}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </motion.div>
                  ))}
                  
                  {filteredEnrollments.length === 0 && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                      No enrollments found
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card-background)] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Assign Courses to {selectedStudent.full_name}
              </h2>
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedStudent(null);
                  setSelectedCourses([]);
                }}
                className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-[var(--text-muted)] mb-4">
              Select the courses you want to assign to this student:
            </p>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {courses.map(course => (
                <label
                  key={course.id}
                  className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--background)] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCourses([...selectedCourses, course.id]);
                      } else {
                        setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                      }
                    }}
                    className="w-5 h-5 rounded border-[var(--border)]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">{course.title}</p>
                    {course.teacher_name && (
                      <p className="text-sm text-[var(--text-muted)]">{course.teacher_name}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedStudent(null);
                  setSelectedCourses([]);
                }}
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnroll}
                disabled={processing || selectedCourses.length === 0}
                className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {processing ? 'Assigning...' : `Assign ${selectedCourses.length} Course(s)`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
