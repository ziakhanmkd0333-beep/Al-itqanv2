"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import { useTranslation } from "@/hooks/use-translation";
import { getCurrentUser } from "@/lib/supabase-browser";
import {
  ClipboardList,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Calendar,
  BookOpen,
  RefreshCw,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Assignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  course_name: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  submission?: {
    id: string;
    submitted_at: string;
    file_url: string;
    grade?: number;
    feedback?: string;
  };
}

export default function StudentAssignmentsPage() {
  return (
    <StudentRoute>
      <StudentAssignmentsContent />
    </StudentRoute>
  );
}

function StudentAssignmentsContent() {
  const { t, isRTL } = useTranslation();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.id) {
      setStudentId(user.id);
      fetchAssignments(user.id);
    }
  }, []);

  const fetchAssignments = async (id: string) => {
    try {
      const response = await fetch(`/api/student/assignments?studentId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedAssignment || !studentId) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('assignmentId', selectedAssignment.id);
      formData.append('studentId', studentId);

      const response = await fetch('/api/student/assignments/submit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit assignment');
      }

      toast.success('Assignment submitted successfully');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      fetchAssignments(studentId);
    } catch (error: unknown) {
      console.error('Error submitting assignment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit assignment');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      submitted: "bg-blue-100 text-blue-700",
      graded: "bg-green-100 text-green-700",
      overdue: "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length,
    overdue: assignments.filter(a => a.status === 'overdue').length
  };

  if (isLoading) {
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("assignments.title") || "My Assignments"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("assignments.subtitle") || "View and submit your course assignments"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: t("assignments.total") || "Total", value: stats.total, icon: ClipboardList, color: "#6B7280" },
            { label: t("assignments.pending") || "Pending", value: stats.pending, icon: Clock, color: "#F59E0B" },
            { label: t("assignments.submitted") || "Submitted", value: stats.submitted, icon: Upload, color: "#3B82F6" },
            { label: t("assignments.graded") || "Graded", value: stats.graded, icon: CheckCircle, color: "#10B981" },
            { label: t("assignments.overdue") || "Overdue", value: stats.overdue, icon: AlertCircle, color: "#EF4444" }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-4 rounded-xl border border-[var(--border)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Assignments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-[var(--border)] overflow-hidden"
        >
          {assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <ClipboardList className="w-12 h-12 mb-4 opacity-50" />
              <p>{t("assignments.noAssignments") || "No assignments found"}</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-6 hover:bg-[var(--background)] transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {assignment.title}
                        </h3>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <p className="text-sm text-[var(--text-muted)] mb-3">
                        {assignment.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                          <BookOpen className="w-4 h-4" />
                          {assignment.course_name}
                        </span>
                        <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                          <Calendar className="w-4 h-4" />
                          {t("assignments.due") || "Due"}: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                        {assignment.submission?.grade !== undefined && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            {t("assignments.grade") || "Grade"}: {assignment.submission.grade}/100
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {assignment.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setIsUploadModalOpen(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{t("assignments.submit") || "Submit"}</span>
                        </button>
                      )}
                      {assignment.status === 'submitted' && (
                        <button
                          onClick={() => window.open(assignment.submission?.file_url, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{t("assignments.view") || "View"}</span>
                        </button>
                      )}
                      {assignment.status === 'graded' && (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{t("assignments.viewFeedback") || "Feedback"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upload Modal */}
        {isUploadModalOpen && selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl border border-[var(--border)] w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {t("assignments.submitAssignment") || "Submit Assignment"}
                </h3>
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadFile(null);
                  }}
                  className="p-2 hover:bg-[var(--background)] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[var(--text-muted)] mb-4">
                {selectedAssignment.title}
              </p>

              <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center mb-4">
                <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
                <p className="text-[var(--text-muted)] mb-2">
                  {uploadFile ? uploadFile.name : (t("assignments.dragDrop") || "Click to select file")}
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadFile(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  {t("common.cancel") || "Cancel"}
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || isUploading}
                  className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    t("assignments.submit") || "Submit"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
