"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  ClipboardList,
  Plus,
  Loader2,
  X,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Eye
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

export default function TeacherAssignmentsPage() {
  return (
    <TeacherRoute>
      <TeacherAssignmentsContent />
    </TeacherRoute>
  );
}

function TeacherAssignmentsContent() {
  const { t, isRTL } = useTranslation();
  const [assignments, setAssignments] = useState<Record<string, unknown>[]>([]);
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Record<string, unknown> | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, unknown>[]>([]);
  const [saving, setSaving] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<Record<string, unknown> | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    course_id: "",
    due_date: "",
    max_marks: 100
  });

  const [gradeData, setGradeData] = useState({
    marks: 0,
    feedback: ""
  });

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/assignments', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Assignments fetch error:', error);
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/courses', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Courses fetch error:', error);
    }
  };

  const fetchSubmissions = async (assignmentId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/teacher/submissions?assignment_id=${assignmentId}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Submissions fetch error:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/assignments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ title: "", description: "", instructions: "", course_id: "", due_date: "", max_marks: 100 });
        fetchAssignments();
      }
    } catch (error) {
      console.error('Create error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/submissions', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submission_id: gradingSubmission.id,
          marks: gradeData.marks,
          feedback: gradeData.feedback
        })
      });

      if (response.ok) {
        setGradingSubmission(null);
        setGradeData({ marks: 0, feedback: "" });
        fetchSubmissions(selectedAssignment.id);
      }
    } catch (error) {
      console.error('Grade error:', error);
    }
  };

  const handleDelete = async (assignmentId: string) => {
    if (!confirm(t("teacher.assignments.confirmDelete") || "Delete this assignment?")) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/teacher/assignments?id=${assignmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        fetchAssignments();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const viewSubmissions = (assignment: Record<string, unknown>) => {
    setSelectedAssignment(assignment);
    fetchSubmissions(assignment.id);
    setShowSubmissionsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{t("teacher.assignments.active") || "Active"}</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{t("teacher.assignments.closed") || "Closed"}</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">{t("teacher.assignments.draft") || "Draft"}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <DashboardSidebar userType="teacher" />
        <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"} flex items-center justify-center`}>
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="teacher" />
      
      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div>
              <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.assignments.title") || "Assignments"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.assignments.subtitle") || "Create and manage assignments for your students"}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Plus className="w-5 h-5" />
              <span>{t("teacher.assignments.create") || "Create Assignment"}</span>
            </button>
          </div>
        </motion.div>

        {/* Assignments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {assignments.length === 0 ? (
            <div className="bg-card rounded-2xl border border-[var(--border)] p-12 text-center">
              <ClipboardList className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                {t("teacher.assignments.none") || "No assignments created yet"}
              </h3>
              <p className="text-[var(--text-muted)] mb-4">
                {t("teacher.assignments.createPrompt") || "Create assignments for your students to complete"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-[var(--primary)] hover:underline"
              >
                {t("teacher.assignments.createFirst") || "Create your first assignment"}
              </button>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-card rounded-2xl border border-[var(--border)] p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <h3 className="font-bold text-[var(--text-primary)]">{assignment.title}</h3>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <p className="text-sm text-[var(--text-muted)] mb-2">{assignment.courses?.title}</p>
                      <div className={`flex items-center gap-4 text-xs text-[var(--text-muted)] ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Calendar className="w-3 h-3" />
                          {t("teacher.assignments.due") || "Due"}: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{assignment.max_marks} {t("teacher.assignments.marks") || "marks"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => viewSubmissions(assignment)}
                      className={`flex items-center gap-2 px-4 py-2 bg-[var(--background-green)] text-[var(--primary)] rounded-xl hover:bg-[var(--primary)]/10 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Users className="w-4 h-4" />
                      <span>{assignment.submissions_count || 0} {t("teacher.assignments.submissions") || "submissions"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {t("teacher.assignments.createNew") || "Create New Assignment"}
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.assignments.course") || "Course"} *</label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                  >
                    <option value="">{t("teacher.assignments.selectCourse") || "Select course"}</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.assignments.title") || "Title"} *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.assignments.description") || "Description"}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.assignments.instructions") || "Instructions"}</label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.assignments.dueDate") || "Due Date"} *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.assignments.maxMarks") || "Max Marks"}</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_marks}
                      onChange={(e) => setFormData({ ...formData, max_marks: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                    />
                  </div>
                </div>

                <div className={`flex justify-end gap-3 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--background-green)] rounded-xl">
                    {t("common.cancel") || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50"
                  >
                    {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> {t("common.creating") || "Creating..."}</> : <><Plus className="w-5 h-5" /> {t("common.create") || "Create"}</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Submissions Modal */}
        {showSubmissionsModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div>
                  <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                    {selectedAssignment.title}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">{submissions.length} {t("teacher.assignments.submissions") || "submissions"}</p>
                </div>
                <button onClick={() => setShowSubmissionsModal(false)} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {gradingSubmission ? (
                <form onSubmit={handleGrade} className="space-y-4">
                  <div className="p-4 bg-[var(--background-green)] rounded-xl">
                    <p className="font-medium">{gradingSubmission.students?.full_name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{gradingSubmission.students?.email}</p>
                    {gradingSubmission.submission_text && (
                      <p className="mt-2 text-sm">{gradingSubmission.submission_text}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {t("teacher.assignments.marks") || "Marks"} (0-{selectedAssignment.max_marks})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedAssignment.max_marks}
                      value={gradeData.marks}
                      onChange={(e) => setGradeData({ ...gradeData, marks: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.assignments.feedback") || "Feedback"}</label>
                    <textarea
                      value={gradeData.feedback}
                      onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] resize-none"
                    />
                  </div>
                  <div className={`flex justify-end gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button type="button" onClick={() => setGradingSubmission(null)} className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--background-green)] rounded-xl">
                      {t("common.cancel") || "Cancel"}
                    </button>
                    <button type="submit" className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2 rounded-xl font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      {t("teacher.assignments.submitGrade") || "Submit Grade"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {submissions.length === 0 ? (
                    <p className="text-center text-[var(--text-muted)] py-8">{t("teacher.assignments.noSubmissions") || "No submissions yet"}</p>
                  ) : (
                    submissions.map((sub) => (
                      <div key={sub.id} className="p-4 border border-[var(--border)] rounded-xl">
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                          <div>
                            <p className="font-medium">{sub.students?.full_name}</p>
                            <p className="text-sm text-[var(--text-muted)]">{sub.students?.email}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                              {t("teacher.assignments.submitted") || "Submitted"}: {new Date(sub.submitted_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            {sub.status === 'graded' ? (
                              <div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{t("teacher.assignments.graded") || "Graded"}</span>
                                <p className="font-bold text-[var(--primary)] mt-1">{sub.marks}/{selectedAssignment.max_marks}</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setGradingSubmission(sub);
                                  setGradeData({ marks: 0, feedback: "" });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm hover:bg-[var(--primary-dark)]"
                              >
                                <Edit2 className="w-4 h-4" />
                                {t("teacher.assignments.grade") || "Grade"}
                              </button>
                            )}
                          </div>
                        </div>
                        {sub.feedback && (
                          <div className="mt-3 p-3 bg-[var(--background-green)] rounded-lg">
                            <p className="text-sm text-[var(--text-muted)]">{t("teacher.assignments.feedback") || "Feedback"}: {sub.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
