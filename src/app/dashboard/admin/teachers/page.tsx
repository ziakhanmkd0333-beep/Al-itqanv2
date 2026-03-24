"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  GraduationCap,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  Phone,
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Globe
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

// Types
interface Teacher {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  specialization: string[];
  qualification: string;
  status: "active" | "inactive" | "on_leave";
  assigned_courses: string[];
  students_count: number;
  created_at: string;
  avatar_url?: string;
  bio?: string;
}

interface TeacherFormData {
  full_name: string;
  email: string;
  phone: string;
  specialization: string[];
  qualification: string;
  status: "active" | "inactive" | "on_leave";
  bio: string;
}

const initialFormData: TeacherFormData = {
  full_name: "",
  email: "",
  phone: "",
  specialization: [],
  qualification: "",
  status: "active",
  bio: ""
};

const specializations = [
  "Quran & Tajweed",
  "Hifz-ul-Quran",
  "Tafseer",
  "Arabic Language",
  "Fiqh",
  "Usool Fiqh",
  "Hadith",
  "Sarf & Nahw",
  "Balaghat"
];

const qualifications = [
  "PhD in Islamic Studies",
  "Masters in Islamic Studies",
  "Daktūra fī ʿUlūm as-Sunnah",
  "Khārij (Dars-e-Nizami)",
  "Shahadat al-Alamiyah",
  "Hafiz-e-Quran",
  "Qari (Tajweed Specialization)",
  "Alim Course",
  "Other"
];

export default function TeachersManagementPage() {
  const { t, isRTL } = useTranslation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>(initialFormData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const [newSpecialization, setNewSpecialization] = useState("");

  const itemsPerPage = 10;

  // Fetch teachers from Supabase
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || teacher.status === statusFilter;
    const matchesSpecialization =
      specializationFilter === "all" || teacher.specialization.includes(specializationFilter);
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const openAddModal = () => {
    setFormData(initialFormData);
    setModalMode("add");
    setShowModal(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    // Convert specialization to array if it's a string
    const specValue = teacher.specialization as unknown as string | string[];
    const specArray = Array.isArray(specValue) 
      ? specValue 
      : typeof specValue === 'string' && specValue.includes(',')
        ? specValue.split(',').map(s => s.trim()).filter(Boolean)
        : specValue ? [specValue] : [];
    
    setFormData({
      full_name: teacher.full_name,
      email: teacher.email,
      phone: teacher.phone,
      specialization: specArray,
      qualification: teacher.qualification,
      status: teacher.status,
      bio: teacher.bio || ""
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const openViewModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setModalMode("view");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    setFormData(initialFormData);
    setNewSpecialization("");
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addSpecialization = (spec: string) => {
    if (spec && !formData.specialization.includes(spec)) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, spec]
      }));
    }
    setNewSpecialization("");
  };

  const removeSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((s) => s !== spec)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        const { error } = await supabase.from("teachers").insert([formData]);
        if (error) throw error;
      } else if (modalMode === "edit" && selectedTeacher) {
        const { error } = await supabase
          .from("teachers")
          .update(formData)
          .eq("id", selectedTeacher.id);
        if (error) throw error;
      }
      await fetchTeachers();
      closeModal();
    } catch (error) {
      console.error("Error saving teacher:", error);
      // Update local state for demo
      if (modalMode === "add") {
        const newTeacher: Teacher = {
          id: Date.now().toString(),
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          qualification: formData.qualification,
          status: formData.status,
          assigned_courses: [],
          students_count: 0,
          created_at: new Date().toISOString().split("T")[0],
          bio: formData.bio
        };
        setTeachers((prev) => [newTeacher, ...prev]);
      } else if (modalMode === "edit" && selectedTeacher) {
        setTeachers((prev) =>
          prev.map((t) =>
            t.id === selectedTeacher.id
              ? {
                  ...t,
                  full_name: formData.full_name,
                  email: formData.email,
                  phone: formData.phone,
                  specialization: formData.specialization,
                  qualification: formData.qualification,
                  status: formData.status,
                  bio: formData.bio
                }
              : t
          )
        );
      }
      closeModal();
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!teacherToDelete) return;
    try {
      const { error } = await supabase.from("teachers").delete().eq("id", teacherToDelete);
      if (error) throw error;
      setTeachers((prev) => prev.filter((t) => t.id !== teacherToDelete));
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setTeachers((prev) => prev.filter((t) => t.id !== teacherToDelete));
    } finally {
      setShowDeleteConfirm(false);
      setTeacherToDelete(null);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700 border-green-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
      on_leave: "bg-yellow-100 text-yellow-700 border-yellow-200"
    };
    const icons: Record<string, React.ReactNode> = {
      active: <CheckCircle className="w-3 h-3" />,
      inactive: <XCircle className="w-3 h-3" />,
      on_leave: <Clock className="w-3 h-3" />
    };
    const labels: Record<string, string> = {
      active: "Active",
      inactive: "Inactive",
      on_leave: "On Leave"
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.inactive}`}
      >
        {icons[status] || icons.inactive}
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="admin" />

      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div>
              <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.teachers.title") || "Teachers Management"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.teachers.subtitle") || "Manage qualified scholars and teachers"}
              </p>
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors">
                <Download className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.export") || "Export"}</span>
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.teachers.addTeacher") || "Add Teacher"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: t("admin.teachers.total") || "Total Teachers", value: teachers.length, icon: GraduationCap, color: "#8B5CF6" },
            { label: t("admin.teachers.active") || "Active", value: teachers.filter((t) => t.status === "active").length, icon: CheckCircle, color: "#10B981" },
            { label: t("admin.teachers.totalStudents") || "Total Students", value: teachers.reduce((sum, t) => sum + (t.students_count || 0), 0), icon: Users, color: "#3B82F6" },
            { label: t("admin.teachers.coursesTaught") || "Courses Taught", value: [...new Set(teachers.flatMap((t) => t.assigned_courses || []))].length, icon: BookOpen, color: "#F59E0B" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card p-4 rounded-xl border border-[var(--border)]"
            >
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div>
                  <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>{stat.label}</p>
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

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card p-4 rounded-xl border border-[var(--border)] mb-6"
        >
          <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div className="flex-1 relative">
              <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
              <input
                type="text"
                placeholder={t("admin.teachers.searchPlaceholder") || "Search by name, email, or phone..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? "pr-10 pl-4 arabic-text" : "pl-10 pr-4"} py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]`}
              />
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.teachers.allStatus") || "All Status"}</option>
                <option value="active">{t("admin.teachers.active") || "Active"}</option>
                <option value="inactive">{t("admin.teachers.inactive") || "Inactive"}</option>
                <option value="on_leave">{t("admin.teachers.onLeave") || "On Leave"}</option>
              </select>
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.teachers.allSpecializations") || "All Specializations"}</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.loading") || "Loading..."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Teacher Header */}
                <div className="relative p-6 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--background-green)]">
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {teacher.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                      <h3 className={`font-bold text-[var(--text-primary)] text-lg ${isRTL ? "arabic-text" : ""}`}>
                        {teacher.full_name}
                      </h3>
                      <p className={`text-sm text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {teacher.qualification}
                      </p>
                      <StatusBadge status={teacher.status} />
                    </div>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="p-6 space-y-4">
                  {/* Contact */}
                  <div className={`flex items-center gap-3 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Mail className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-[var(--text-secondary)] truncate">{teacher.email}</span>
                  </div>
                  <div className={`flex items-center gap-3 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Phone className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-[var(--text-secondary)]">{teacher.phone}</span>
                  </div>

                  {/* Specializations */}
                  <div>
                    <p className={`text-xs text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.teachers.specializations") || "Specializations"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        const specValue = teacher.specialization as unknown as string | string[];
                        const specs = Array.isArray(specValue) ? specValue : 
                          typeof specValue === 'string' && specValue.includes(',') 
                            ? specValue.split(',').map(s => s.trim()).filter(Boolean)
                            : specValue ? [specValue] : [];
                        return (
                          <>
                            {specs.slice(0, 3).map((spec, i) => (
                              <span
                                key={i}
                                className={`px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs ${isRTL ? "arabic-text" : ""}`}
                              >
                                {spec}
                              </span>
                            ))}
                            {specs.length > 3 ? (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{specs.length - 3}
                              </span>
                            ) : null}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className={`flex items-center gap-4 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Users className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm text-[var(--text-secondary)]">
                        {teacher.students_count} {t("admin.teachers.students") || "students"}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm text-[var(--text-secondary)]">
                        {(teacher.assigned_courses || []).length} {t("admin.teachers.courses") || "courses"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-2 pt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => openViewModal(teacher)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.view") || "View"}</span>
                    </button>
                    <button
                      onClick={() => openEditModal(teacher)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.edit") || "Edit"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTeacherToDelete(teacher.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center justify-between mt-6 p-4 bg-card rounded-xl border border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.showing") || "Showing"} {(currentPage - 1) * itemsPerPage + 1} {t("admin.to") || "to"}{" "}
              {Math.min(currentPage * itemsPerPage, filteredTeachers.length)} {t("admin.of") || "of"} {filteredTeachers.length}{" "}
              {t("admin.teachers.results") || "teachers"}
            </p>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg ${
                    currentPage === page
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] hover:bg-[var(--background-green)]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredTeachers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GraduationCap className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className={`text-xl font-semibold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.teachers.noResults") || "No teachers found"}
            </h3>
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.teachers.tryDifferent") || "Try adjusting your search or filter criteria"}
            </p>
          </motion.div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {modalMode === "add"
                    ? t("admin.teachers.addTeacher") || "Add New Teacher"
                    : modalMode === "edit"
                    ? t("admin.teachers.editTeacher") || "Edit Teacher"
                    : t("admin.teachers.viewTeacher") || "Teacher Profile"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Modal Content */}
              {modalMode === "view" && selectedTeacher ? (
                <div className="p-6 space-y-6">
                  {/* Teacher Avatar and Basic Info */}
                  <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-20 h-20 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold">
                      {selectedTeacher.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <h3 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedTeacher.full_name}
                      </h3>
                      <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedTeacher.qualification}
                      </p>
                      <StatusBadge status={selectedTeacher.status} />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Mail className="w-5 h-5 text-[var(--primary)]" />
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.teachers.email") || "Email"}</p>
                        <p className="text-[var(--text-primary)]">{selectedTeacher.email}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Phone className="w-5 h-5 text-[var(--primary)]" />
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.teachers.phone") || "Phone"}</p>
                        <p className="text-[var(--text-primary)]">{selectedTeacher.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.teachers.specializations") || "Specializations"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const specValue = selectedTeacher.specialization as unknown as string | string[];
                        const specs = Array.isArray(specValue) ? specValue : 
                          typeof specValue === 'string' && specValue.includes(',') 
                            ? specValue.split(',').map(s => s.trim()).filter(Boolean)
                            : specValue ? [specValue] : [];
                        return specs.map((spec, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-2 px-3 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg text-sm ${isRTL ? "arabic-text" : ""}`}
                          >
                            <Award className="w-4 h-4" />
                            {spec}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Assigned Courses */}
                  <div>
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.teachers.assignedCourses") || "Assigned Courses"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.assigned_courses?.length > 0 ? (
                        selectedTeacher.assigned_courses.map((course, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-2 px-3 py-2 bg-[var(--background-green)] text-[var(--text-primary)] rounded-lg text-sm border border-[var(--border)] ${isRTL ? "arabic-text" : ""}`}
                          >
                            <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                            {course}
                          </span>
                        ))
                      ) : (
                        <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                          {t("admin.teachers.noCourses") || "No courses assigned"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {selectedTeacher.bio && (
                    <div>
                      <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.bio") || "Biography"}
                      </h4>
                      <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                        {selectedTeacher.bio}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <Users className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{selectedTeacher.students_count}</p>
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.students") || "Students"}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <BookOpen className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{(selectedTeacher.assigned_courses || []).length}</p>
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.courses") || "Courses"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => {
                        closeModal();
                        openEditModal(selectedTeacher);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.teachers.editTeacher") || "Edit Teacher"}</span>
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                    >
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.close") || "Close"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.form.fullName") || "Full Name"} *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.form.email") || "Email"} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.form.phone") || "Phone"} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                      />
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.form.qualification") || "Qualification"} *
                      </label>
                      <select
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        <option value="">{t("admin.teachers.form.selectQualification") || "Select Qualification"}</option>
                        {qualifications.map((qual) => (
                          <option key={qual} value={qual}>
                            {qual}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.form.status") || "Status"} *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        <option value="active">{t("admin.teachers.active") || "Active"}</option>
                        <option value="inactive">{t("admin.teachers.inactive") || "Inactive"}</option>
                        <option value="on_leave">{t("admin.teachers.onLeave") || "On Leave"}</option>
                      </select>
                    </div>

                    {/* Specializations */}
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.form.specializations") || "Specializations"}
                      </label>
                      <div className={`flex gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <select
                          value={newSpecialization}
                          onChange={(e) => setNewSpecialization(e.target.value)}
                          className={`flex-1 px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                        >
                          <option value="">{t("admin.teachers.form.selectSpecialization") || "Select Specialization"}</option>
                          {specializations
                            .filter((s) => !(formData.specialization || []).includes(s))
                            .map((spec) => (
                              <option key={spec} value={spec}>
                                {spec}
                              </option>
                            ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => addSpecialization(newSpecialization)}
                          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.specialization || []).map((spec) => (
                          <span
                            key={spec}
                            className={`inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                          >
                            {spec}
                            <button
                              type="button"
                              onClick={() => removeSpecialization(spec)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.teachers.form.bio") || "Biography"}
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none ${isRTL ? "arabic-text" : ""}`}
                        placeholder={t("admin.teachers.form.bioPlaceholder") || "Brief biography and teaching experience..."}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                    >
                      {modalMode === "add" ? (
                        <>
                          <Plus className="w-4 h-4" />
                          <span className={isRTL ? "arabic-text" : ""}>{t("admin.teachers.addTeacher") || "Add Teacher"}</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          <span className={isRTL ? "arabic-text" : ""}>{t("admin.teachers.updateTeacher") || "Update Teacher"}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                    >
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.cancel") || "Cancel"}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className={`text-xl font-bold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {t("admin.teachers.deleteConfirm.title") || "Delete Teacher?"}
                </h3>
                <p className={`text-[var(--text-muted)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                  {t("admin.teachers.deleteConfirm.message") || "This action cannot be undone. The teacher will be permanently removed from the system."}
                </p>
                <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className={isRTL ? "arabic-text" : ""}>{t("admin.teachers.deleteConfirm.confirm") || "Delete"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setTeacherToDelete(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                  >
                    <span className={isRTL ? "arabic-text" : ""}>{t("admin.cancel") || "Cancel"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
