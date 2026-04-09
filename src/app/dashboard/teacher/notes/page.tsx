"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

export default function TeacherNotesPage() {
  return (
    <TeacherRoute>
      <TeacherNotesContent />
    </TeacherRoute>
  );
}

interface SessionNote {
  id: string;
  student_id: string;
  student_name: string;
  course_id: string;
  course_title: string;
  date: string;
  topic: string;
  notes: string;
  progress: 'excellent' | 'good' | 'average' | 'needs_improvement';
  homework?: string;
  next_topic?: string;
  created_at: string;
}

function TeacherNotesContent() {
  const { t, isRTL } = useTranslation();
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<SessionNote | null>(null);
  const [students, setStudents] = useState<Record<string, unknown>[]>([]);
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    date: new Date().toISOString().split('T')[0],
    topic: "",
    notes: "",
    progress: "good" as SessionNote['progress'],
    homework: "",
    next_topic: ""
  });

  useEffect(() => {
    fetchNotes();
    fetchStudentsAndCourses();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/teacher/notes', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Notes fetch error:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [studentsRes, coursesRes] = await Promise.all([
        fetch('/api/teacher/students/all', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        }),
        fetch('/api/teacher/courses', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
      ]);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const url = editingNote ? `/api/teacher/notes/${editingNote.id}` : '/api/teacher/notes';
      const method = editingNote ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchNotes();
        closeModal();
      }
    } catch (error) {
      console.error('Save note error:', error);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm(t("teacher.notes.deleteConfirm") || "Delete this note?")) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/teacher/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        await fetchNotes();
      }
    } catch (error) {
      console.error('Delete note error:', error);
    }
  };

  const openAddModal = () => {
    setEditingNote(null);
    setFormData({
      student_id: "",
      course_id: "",
      date: new Date().toISOString().split('T')[0],
      topic: "",
      notes: "",
      progress: "good",
      homework: "",
      next_topic: ""
    });
    setShowModal(true);
  };

  const openEditModal = (note: SessionNote) => {
    setEditingNote(note);
    setFormData({
      student_id: note.student_id,
      course_id: note.course_id,
      date: note.date,
      topic: note.topic,
      notes: note.notes,
      progress: note.progress,
      homework: note.homework || "",
      next_topic: note.next_topic || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
  };

  const filteredNotes = notes.filter(note =>
    note.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.course_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgressColor = (progress: string) => {
    const colors: Record<string, string> = {
      excellent: "bg-green-100 text-green-700",
      good: "bg-blue-100 text-blue-700",
      average: "bg-yellow-100 text-yellow-700",
      needs_improvement: "bg-red-100 text-red-700"
    };
    return colors[progress] || "bg-gray-100 text-gray-700";
  };

  const getProgressLabel = (progress: string) => {
    const labels: Record<string, string> = {
      excellent: t("teacher.notes.excellent") || "Excellent",
      good: t("teacher.notes.good") || "Good",
      average: t("teacher.notes.average") || "Average",
      needs_improvement: t("teacher.notes.needsImprovement") || "Needs Improvement"
    };
    return labels[progress] || progress;
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
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div>
              <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.notes.title") || "Session Notes"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.notes.subtitle") || "Track student progress and session details"}
              </p>
            </div>
            <button
              onClick={openAddModal}
              className={`flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Plus className="w-5 h-5" />
              <span>{t("teacher.notes.addNote") || "Add Note"}</span>
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-4 rounded-xl border border-[var(--border)] mb-6"
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Search className="w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={t("teacher.notes.searchPlaceholder") || "Search by student, topic, or course..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 bg-transparent border-none focus:outline-none text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
            />
          </div>
        </motion.div>

        {/* Notes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-[var(--border)]">
              <FileText className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.notes.noNotes") || "No session notes yet"}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-xl border border-[var(--border)] overflow-hidden"
              >
                <div
                  className={`p-4 cursor-pointer hover:bg-[var(--background-green)] transition-colors ${isRTL ? "text-right" : ""}`}
                  onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                >
                  <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-[var(--primary)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">{note.student_name}</h3>
                        <div className={`flex items-center gap-2 text-sm text-[var(--text-muted)] ${isRTL ? "flex-row-reverse" : ""}`}>
                          <BookOpen className="w-4 h-4" />
                          <span>{note.course_title}</span>
                          <span>•</span>
                          <Calendar className="w-4 h-4" />
                          <span>{note.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProgressColor(note.progress)}`}>
                        {getProgressLabel(note.progress)}
                      </span>
                      {expandedNote === note.id ? (
                        <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedNote === note.id && (
                  <div className={`px-4 pb-4 border-t border-[var(--border)] ${isRTL ? "text-right" : ""}`}>
                    <div className="pt-4 space-y-4">
                      <div>
                        <h4 className={`text-sm font-medium text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>
                          {t("teacher.notes.topic") || "Topic"}
                        </h4>
                        <p className="text-[var(--text-primary)]">{note.topic}</p>
                      </div>

                      <div>
                        <h4 className={`text-sm font-medium text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>
                          {t("teacher.notes.sessionNotes") || "Session Notes"}
                        </h4>
                        <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{note.notes}</p>
                      </div>

                      {note.homework && (
                        <div>
                          <h4 className={`text-sm font-medium text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>
                            {t("teacher.notes.homework") || "Homework"}
                          </h4>
                          <p className="text-[var(--text-secondary)]">{note.homework}</p>
                        </div>
                      )}

                      {note.next_topic && (
                        <div>
                          <h4 className={`text-sm font-medium text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>
                            {t("teacher.notes.nextTopic") || "Next Topic"}
                          </h4>
                          <p className="text-[var(--text-secondary)]">{note.next_topic}</p>
                        </div>
                      )}

                      <div className={`flex gap-2 pt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <button
                          onClick={() => openEditModal(note)}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>{t("admin.edit") || "Edit"}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{t("admin.delete") || "Delete"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Add/Edit Modal */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className={`flex items-center justify-between p-6 border-b border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {editingNote 
                    ? t("teacher.notes.editNote") || "Edit Note"
                    : t("teacher.notes.addNote") || "Add Session Note"
                  }
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("teacher.notes.student") || "Student"} *
                    </label>
                    <select
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      required
                      className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                    >
                      <option value="">{t("teacher.notes.selectStudent") || "Select Student"}</option>
                      {students.map((student: Record<string, unknown>) => (
                        <option key={String(student.id)} value={String(student.id)}>{String(student.full_name)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("teacher.notes.course") || "Course"} *
                    </label>
                    <select
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                      required
                      className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                    >
                      <option value="">{t("teacher.notes.selectCourse") || "Select Course"}</option>
                      {courses.map((course: Record<string, unknown>) => (
                        <option key={String(course.id)} value={String(course.id)}>{String(course.title)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("teacher.notes.date") || "Date"} *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("teacher.notes.progress") || "Progress"} *
                    </label>
                    <select
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: e.target.value as SessionNote['progress'] })}
                      required
                      className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                    >
                      <option value="excellent">{t("teacher.notes.excellent") || "Excellent"}</option>
                      <option value="good">{t("teacher.notes.good") || "Good"}</option>
                      <option value="average">{t("teacher.notes.average") || "Average"}</option>
                      <option value="needs_improvement">{t("teacher.notes.needsImprovement") || "Needs Improvement"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.notes.topic") || "Topic"} *
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    required
                    className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                    placeholder={t("teacher.notes.topicPlaceholder") || "e.g., Surah Al-Baqarah Verses 1-10"}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.notes.sessionNotes") || "Session Notes"} *
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    required
                    rows={4}
                    className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none ${isRTL ? "arabic-text" : ""}`}
                    placeholder={t("teacher.notes.notesPlaceholder") || "Detailed notes about the session..."}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.notes.homework") || "Homework"}
                  </label>
                  <input
                    type="text"
                    value={formData.homework}
                    onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                    className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                    placeholder={t("teacher.notes.homeworkPlaceholder") || "e.g., Memorize verses 1-5"}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.notes.nextTopic") || "Next Topic"}
                  </label>
                  <input
                    type="text"
                    value={formData.next_topic}
                    onChange={(e) => setFormData({ ...formData, next_topic: e.target.value })}
                    className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                    placeholder={t("teacher.notes.nextTopicPlaceholder") || "e.g., Continue with verses 11-20"}
                  />
                </div>

                <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingNote ? (t("admin.update") || "Update") : (t("admin.save") || "Save")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                  >
                    <span>{t("admin.cancel") || "Cancel"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl"
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <ClipboardList className="w-6 h-6 text-yellow-600" />
            <p className={`text-sm text-yellow-800 ${isRTL ? "arabic-text" : ""}`}>
              {t("teacher.notes.comingSoon") || "Full session notes management coming soon. Basic functionality available now."}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
