"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  FileText,
  Upload,
  Trash2,
  Loader2,
  X,
  File,
  Video,
  Image as ImageIcon,
  Download,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

export default function TeacherMaterialsPage() {
  return (
    <TeacherRoute>
      <TeacherMaterialsContent />
    </TeacherRoute>
  );
}

function TeacherMaterialsContent() {
  const { t, isRTL } = useTranslation();
  const [materials, setMaterials] = useState<Record<string, unknown>[]>([]);
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    file_url: "",
    file_type: "pdf"
  });

  const fetchMaterials = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      let url = '/api/teacher/materials';
      if (selectedCourse) {
        url += `?course_id=${selectedCourse}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setMaterials(data.materials || []);
      } else {
        setMaterials([]);
      }
    } catch (error) {
      console.error('Materials fetch error:', error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  const fetchCourses = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/courses', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Courses fetch error:', error);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, [fetchMaterials, fetchCourses]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/materials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowUploadModal(false);
        setFormData({ title: "", description: "", course_id: "", file_url: "", file_type: "pdf" });
        fetchMaterials();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm(t("teacher.materials.confirmDelete") || "Are you sure you want to delete this material?")) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/teacher/materials?id=${materialId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-8 h-8 text-red-500" />;
      case 'image': return <ImageIcon className="w-8 h-8 text-green-500" />;
      default: return <File className="w-8 h-8 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                {t("teacher.materials.title") || "Learning Materials"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.materials.subtitle") || "Upload and manage course materials"}
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Upload className="w-5 h-5" />
              <span>{t("teacher.materials.upload") || "Upload Material"}</span>
            </button>
          </div>
        </motion.div>

        {/* Course Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[var(--border)] bg-card text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">{t("teacher.materials.allCourses") || "All Courses"}</option>
            {courses.map((course: Record<string, unknown>) => (
              <option key={String(course.id)} value={String(course.id)}>{String(course.title)}</option>
            ))}
          </select>
        </motion.div>

        {/* Materials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {materials.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 bg-card rounded-2xl border border-[var(--border)] p-12 text-center">
              <FileText className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                {t("teacher.materials.none") || "No materials uploaded yet"}
              </h3>
              <p className="text-[var(--text-muted)] mb-4">
                {t("teacher.materials.uploadPrompt") || "Upload PDFs, videos, and other learning resources for your students"}
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-[var(--primary)] hover:underline"
              >
                {t("teacher.materials.uploadFirst") || "Upload your first material"}
              </button>
            </div>
          ) : (
            materials.map((material: Record<string, unknown>) => (
              <div
                key={String(material.id)}
                className="bg-card rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    {getFileIcon(String(material.file_type))}
                    <button
                      onClick={() => handleDelete(String(material.id))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-[var(--text-primary)] mt-4 mb-2">{String(material.title)}</h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2">{String(material.description)}</p>
                  
                  <div className={`flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span>{String((material.courses as Record<string, unknown>)?.title)}</span>
                    <span>•</span>
                    <span>{formatFileSize(Number(material.file_size) || 0)}</span>
                  </div>
                  
                  <div className={`flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => setExpandedMaterial(expandedMaterial === String(material.id) ? null : String(material.id))}
                      className="text-[var(--primary)] text-sm hover:underline flex items-center gap-1"
                    >
                      {expandedMaterial === String(material.id) ? (
                        <><ChevronUp className="w-4 h-4" /> Less</>
                      ) : (
                        <><ChevronDown className="w-4 h-4" /> More</>
                      )}
                    </button>
                    <a
                      href={String(material.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[var(--primary)] hover:underline text-sm"
                    >
                      <Download className="w-4 h-4" />
                      {t("teacher.materials.download") || "Download"}
                    </a>
                  </div>
                  
                  {expandedMaterial === String(material.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-4 pt-4 border-t border-[var(--border)]"
                    >
                      <p className="text-sm text-[var(--text-muted)]">
                        {t("teacher.materials.uploaded") || "Uploaded"}: {new Date(String(material.uploaded_at)).toLocaleDateString()}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            ))
          )}
        </motion.div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {t("teacher.materials.uploadNew") || "Upload New Material"}
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-[var(--background-green)] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.materials.course") || "Course"} *
                  </label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="">{t("teacher.materials.selectCourse") || "Select a course"}</option>
                    {courses.map((course: Record<string, unknown>) => (
                      <option key={String(course.id)} value={String(course.id)}>{String(course.title)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.materials.title") || "Title"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.materials.description") || "Description"}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.materials.fileType") || "File Type"}
                  </label>
                  <select
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="doc">Word Document</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.materials.fileUrl") || "File URL"} *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {t("teacher.materials.urlHelp") || "Enter the URL where the file is hosted"}
                  </p>
                </div>

                <div className={`flex justify-end gap-3 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--background-green)] rounded-xl transition-colors"
                  >
                    {t("common.cancel") || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t("common.uploading") || "Uploading..."}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>{t("common.upload") || "Upload"}</span>
                      </>
                    )}
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
