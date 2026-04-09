"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  Bell,
  Plus,
  Loader2,
  X,
  Megaphone,
  Calendar,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

export default function TeacherAnnouncementsPage() {
  return (
    <TeacherRoute>
      <TeacherAnnouncementsContent />
    </TeacherRoute>
  );
}

function TeacherAnnouncementsContent() {
  const { t, isRTL } = useTranslation();
  const [announcements, setAnnouncements] = useState<Record<string, unknown>[]>([]);
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    course_id: "",
    priority: "normal",
    expires_at: ""
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchCourses();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/announcements', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Announcements fetch error:', error);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ title: "", message: "", course_id: "", priority: "normal", expires_at: "" });
        fetchAnnouncements();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || `Failed to create announcement`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("teacher.announcements.confirmDelete") || "Delete this announcement?")) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/teacher/announcements?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high': return <Megaphone className="w-5 h-5 text-orange-500" />;
      case 'low': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-[var(--primary)]" />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-[var(--background-green)] border-[var(--border)]';
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
                {t("teacher.announcements.title") || "Announcements"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.announcements.subtitle") || "Send announcements to your students"}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Plus className="w-5 h-5" />
              <span>{t("teacher.announcements.new") || "New Announcement"}</span>
            </button>
          </div>
        </motion.div>

        {/* Announcements List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {announcements.length === 0 ? (
            <div className="bg-card rounded-2xl border border-[var(--border)] p-12 text-center">
              <Bell className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                {t("teacher.announcements.none") || "No announcements yet"}
              </h3>
              <p className="text-[var(--text-muted)] mb-4">
                {t("teacher.announcements.createPrompt") || "Create announcements to notify your students"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-[var(--primary)] hover:underline"
              >
                {t("teacher.announcements.createFirst") || "Create your first announcement"}
              </button>
            </div>
          ) : (
            announcements.map((announcement: Record<string, unknown>) => (
              <div
                key={String(announcement.id)}
                className={`rounded-2xl border p-6 ${getPriorityClass(String(announcement.priority))}`}
              >
                <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      {getPriorityIcon(String(announcement.priority))}
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <div className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <h3 className="font-bold text-[var(--text-primary)]">{String(announcement.title)}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          String(announcement.priority) === 'urgent' ? 'bg-red-100 text-red-700' :
                          String(announcement.priority) === 'high' ? 'bg-orange-100 text-orange-700' :
                          String(announcement.priority) === 'low' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {String(announcement.priority)}
                        </span>
                      </div>
                      <p className="text-[var(--text-primary)] whitespace-pre-wrap">{String(announcement.message)}</p>
                      <div className={`flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)] ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Calendar className="w-3 h-3" />
                          {new Date(String(announcement.created_at || Date.now())).toLocaleDateString()}
                        </span>
                        {Boolean((announcement.courses as Record<string, unknown>)?.title) && (
                          <>
                            <span>•</span>
                            <span>{String((announcement.courses as Record<string, unknown>)?.title)}</span>
                          </>
                        )}
                        {Boolean(announcement.expires_at) && (
                          <>
                            <span>•</span>
                            <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <Clock className="w-3 h-3" />
                              {t("teacher.announcements.expires") || "Expires"}: {new Date(String(announcement.expires_at)).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(String(announcement.id))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
                  {t("teacher.announcements.createNew") || "New Announcement"}
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.announcements.course") || "Course (Optional)"}</label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                  >
                    <option value="">{t("teacher.announcements.allStudents") || "All Students"}</option>
                    {courses.map((c: Record<string, unknown>) => <option key={String(c.id)} value={String(c.id)}>{String(c.title)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.announcements.priority") || "Priority"}</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                  >
                    <option value="low">{t("teacher.announcements.low") || "Low"}</option>
                    <option value="normal">{t("teacher.announcements.normal") || "Normal"}</option>
                    <option value="high">{t("teacher.announcements.high") || "High"}</option>
                    <option value="urgent">{t("teacher.announcements.urgent") || "Urgent"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.announcements.title") || "Title"} *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.announcements.message") || "Message"} *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t("teacher.announcements.expiresAt") || "Expires At (Optional)"}</label>
                  <input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                  />
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
                    {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> {t("common.sending") || "Sending..."}</> : <><CheckCircle2 className="w-5 h-5" /> {t("common.send") || "Send"}</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
