"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  Users,
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
  MapPin,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Globe
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useAdminStudents } from "@/hooks/use-realtime-data";

// Types
interface Student {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  age: number;
  language: string;
  status: "active" | "inactive" | "suspended";
  enrolled_courses: string[];
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
}

interface StudentFormData {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  age: number;
  language: string;
  status: "active" | "inactive" | "suspended";
}

const initialFormData: StudentFormData = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  age: 0,
  language: "en",
  status: "active"
};

const countries = [
  "Pakistan", "Saudi Arabia", "UAE", "USA", "UK", "Canada", "Australia",
  "India", "Bangladesh", "Egypt", "Turkey", "Malaysia", "Indonesia", "Other"
];

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "ur", label: "Urdu" }
];

export default function StudentsManagementPage() {
  const { t, isRTL } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Use real-time hook for students
  const {
    students: fetchedStudents,
    loading,
    refetch,
    createStudent,
    updateStudent,
    deleteStudent
  } = useAdminStudents(currentPage, itemsPerPage, searchQuery, statusFilter === "all" ? "" : statusFilter);

  // Use fetched students directly from hook
  const students = fetchedStudents;

  // Filter and search logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const openAddModal = () => {
    setFormData(initialFormData);
    setModalMode("add");
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      full_name: student.full_name,
      email: student.email,
      phone: student.phone,
      country: student.country,
      age: student.age,
      language: student.language,
      status: student.status
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const openViewModal = (student: Student) => {
    setSelectedStudent(student);
    setModalMode("view");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFormData(initialFormData);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await createStudent({
          ...formData,
          password: 'temp123'
        });
      } else if (modalMode === "edit" && selectedStudent) {
        await updateStudent(selectedStudent.id, formData as unknown as Record<string, unknown>);
      }
      refetch();
      closeModal();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student. Please try again.");
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudent(studentToDelete);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    } finally {
      setShowDeleteConfirm(false);
      setStudentToDelete(null);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      active: "bg-green-100 text-green-700 border-green-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
      suspended: "bg-red-100 text-red-700 border-red-200"
    };
    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      inactive: <Clock className="w-3 h-3" />,
      suspended: <XCircle className="w-3 h-3" />
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}
      >
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                {t("admin.students.title") || "Students Management"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.students.subtitle") || "Manage all enrolled students"}
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
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.students.addStudent") || "Add Student"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: t("admin.students.total") || "Total Students", value: students.length, icon: Users, color: "#3B82F6" },
            { label: t("admin.students.active") || "Active", value: students.filter((s) => s.status === "active").length, icon: CheckCircle, color: "#10B981" },
            { label: t("admin.students.inactive") || "Inactive", value: students.filter((s) => s.status === "inactive").length, icon: Clock, color: "#6B7280" },
            { label: t("admin.students.suspended") || "Suspended", value: students.filter((s) => s.status === "suspended").length, icon: XCircle, color: "#EF4444" }
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
                placeholder={t("admin.students.searchPlaceholder") || "Search by name, email, or phone..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? "pr-10 pl-4 arabic-text" : "pl-10 pr-4"} py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]`}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.students.allStatus") || "All Status"}</option>
                <option value="active">{t("admin.students.active") || "Active"}</option>
                <option value="inactive">{t("admin.students.inactive") || "Inactive"}</option>
                <option value="suspended">{t("admin.students.suspended") || "Suspended"}</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-xl border border-[var(--border)] overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.loading") || "Loading..."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--background-green)]">
                    <tr>
                      <th className={`px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                        {t("admin.students.table.name") || "Student"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.students.table.contact") || "Contact"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.students.table.country") || "Country"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.students.table.courses") || "Courses"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.students.table.status") || "Status"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.students.table.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {paginatedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-[var(--background-green)] transition-colors">
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold">
                              {student.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{student.full_name}</p>
                              <p className="text-sm text-[var(--text-muted)]">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <p className="text-[var(--text-primary)]">{student.phone}</p>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <p className={`text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{student.country}</p>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-medium">
                            <BookOpen className="w-3 h-3" />
                            {student.enrolled_courses?.length || 0} courses
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <StatusBadge status={student.status} />
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <button
                              onClick={() => openViewModal(student)}
                              className="p-2 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4 text-[var(--primary)]" />
                            </button>
                            <button
                              onClick={() => openEditModal(student)}
                              className="p-2 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-[var(--primary)]" />
                            </button>
                            <button
                              onClick={() => {
                                setStudentToDelete(student.id);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`flex items-center justify-between px-6 py-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                  <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                    {t("admin.showing") || "Showing"} {(currentPage - 1) * itemsPerPage + 1} {t("admin.to") || "to"}{" "}
                    {Math.min(currentPage * itemsPerPage, filteredStudents.length)} {t("admin.of") || "of"} {filteredStudents.length}{" "}
                    {t("admin.students.results") || "students"}
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
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Empty State */}
        {!loading && filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className={`text-xl font-semibold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.students.noResults") || "No students found"}
            </h3>
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.students.tryDifferent") || "Try adjusting your search or filter criteria"}
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--background)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--border)]"
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {modalMode === "add"
                    ? t("admin.students.addStudent") || "Add New Student"
                    : modalMode === "edit"
                    ? t("admin.students.editStudent") || "Edit Student"
                    : t("admin.students.viewStudent") || "Student Details"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Modal Content */}
              {modalMode === "view" && selectedStudent ? (
                <div className="p-6 space-y-6">
                  {/* Student Avatar and Basic Info */}
                  <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-20 h-20 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold">
                      {selectedStudent.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || 'ST'}
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <h3 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedStudent.full_name}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">ID: {selectedStudent.id}</p>
                      <div className="mt-2">
                        <StatusBadge status={selectedStudent.status} />
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.students.personalInfo") || "Personal Information"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Calendar className="w-5 h-5 text-[var(--primary)]" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.students.age") || "Age"}</p>
                          <p className="text-[var(--text-primary)] font-medium">{selectedStudent.age || 'N/A'} years</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Globe className="w-5 h-5 text-[var(--primary)]" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.students.language") || "Language"}</p>
                          <p className="text-[var(--text-primary)] font-medium">
                            {selectedStudent.language === 'en' ? 'English' : 
                             selectedStudent.language === 'ar' ? 'Arabic' : 
                             selectedStudent.language === 'ur' ? 'Urdu' : selectedStudent.language || 'English'}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                        <MapPin className="w-5 h-5 text-[var(--primary)]" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.students.country") || "Country"}</p>
                          <p className={`text-[var(--text-primary)] font-medium ${isRTL ? "arabic-text" : ""}`}>{selectedStudent.country || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.students.contactInfo") || "Contact Information"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Mail className="w-5 h-5 text-[var(--primary)]" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.students.email") || "Email"}</p>
                          <p className="text-[var(--text-primary)]">{selectedStudent.email}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Phone className="w-5 h-5 text-[var(--primary)]" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.students.phone") || "Phone"}</p>
                          <p className="text-[var(--text-primary)]">{selectedStudent.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div>
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.students.accountInfo") || "Account Information"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Clock className="w-5 h-5 text-[var(--primary)]" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.students.joined") || "Joined"}</p>
                          <p className="text-[var(--text-primary)]">
                            {selectedStudent.created_at 
                              ? new Date(selectedStudent.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                }) 
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                        <RefreshCw className="w-5 h-5 text-[var(--primary)]" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.students.lastUpdated") || "Last Updated"}</p>
                          <p className="text-[var(--text-primary)]">
                            {selectedStudent.updated_at && selectedStudent.updated_at !== selectedStudent.created_at
                              ? new Date(selectedStudent.updated_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                }) 
                              : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enrolled Courses */}
                  <div>
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.students.enrolledCourses") || "Enrolled Courses"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.enrolled_courses?.length > 0 ? (
                        selectedStudent.enrolled_courses.map((course: string, index: number) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-2 px-3 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg text-sm ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                          >
                            <BookOpen className="w-4 h-4" />
                            {course}
                          </span>
                        ))
                      ) : (
                        <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                          {t("admin.students.noCourses") || "No courses enrolled"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => {
                        closeModal();
                        openEditModal(selectedStudent);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.students.editStudent") || "Edit Student"}</span>
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
                        {t("admin.students.form.fullName") || "Full Name"} *
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
                        {t("admin.students.form.email") || "Email"} *
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
                        {t("admin.students.form.phone") || "Phone"} *
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

                    {/* Country */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.students.form.country") || "Country"} *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        <option value="">{t("admin.students.form.selectCountry") || "Select Country"}</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Age */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.students.form.age") || "Age"} *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age || ""}
                        onChange={handleInputChange}
                        required
                        min="5"
                        max="100"
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                      />
                    </div>

                    {/* Language */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.students.form.language") || "Preferred Language"} *
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.students.form.status") || "Status"} *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        <option value="active">{t("admin.students.active") || "Active"}</option>
                        <option value="inactive">{t("admin.students.inactive") || "Inactive"}</option>
                        <option value="suspended">{t("admin.students.suspended") || "Suspended"}</option>
                      </select>
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
                          <span className={isRTL ? "arabic-text" : ""}>{t("admin.students.addStudent") || "Add Student"}</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          <span className={isRTL ? "arabic-text" : ""}>{t("admin.students.updateStudent") || "Update Student"}</span>
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
                  {t("admin.students.deleteConfirm.title") || "Delete Student?"}
                </h3>
                <p className={`text-[var(--text-muted)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                  {t("admin.students.deleteConfirm.message") || "This action cannot be undone. The student will be permanently removed from the system."}
                </p>
                <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className={isRTL ? "arabic-text" : ""}>{t("admin.students.deleteConfirm.confirm") || "Delete"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setStudentToDelete(null);
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
