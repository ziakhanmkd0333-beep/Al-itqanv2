"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  ClipboardList,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  MessageSquare,
  Filter,
  Download,
  Eye,
  UserCheck,
  UserX,
  Pause
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

// Types
interface Admission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  age: number;
  language: string;
  course_id: string;
  course_name: string;
  preferred_timing: string;
  guardian_name?: string;
  guardian_phone?: string;
  status: "pending" | "approved" | "rejected" | "deferred";
  applied_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  admin_notes?: string;
}

const courses = [
  "Noorani Qaida",
  "Nazra Quran",
  "Quran with Tajweed",
  "Advanced Tajweed Program",
  "Hifz-ul-Quran",
  "Tarjamat-ul-Quran",
  "Advanced Tafseer-ul-Quran",
  "Beginner Arabic",
  "Intermediate Arabic",
  "Advanced Spoken Arabic",
  "Advanced Ilm-e-Balaghat",
  "Basic Fiqh (Qudoori)",
  "Intermediate Fiqh (Kanz)",
  "Advanced Fiqh (Hidaya)",
  "Basic Usool Fiqh (Shashi)",
  "Intermediate Usool Fiqh",
  "Advanced Usool Fiqh",
  "Basic Sarf & Nahw",
  "Intermediate Sarf & Nahw",
  "Advanced Sarf & Nahw",
  "Basic Hadith",
  "Intermediate Hadith",
  "Advanced Hadith",
  "Takhassus fil Hadith"
];

export default function AdmissionsManagementPage() {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "defer" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const itemsPerPage = 10;

  // Fetch admissions from admin API
  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/admissions?page=1&limit=100', { credentials: 'include' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      // Transform API data to match Admission interface
      const transformedAdmissions: Admission[] = (data.admissions || []).map((a: any) => ({
        id: a.id,
        full_name: a.full_name,
        email: a.email,
        phone: a.phone || '',
        country: a.country || '',
        age: a.age || 0,
        language: a.language || 'en',
        course_id: a.course_id || '',
        course_name: a.courses?.title || 'Unknown Course',
        preferred_timing: a.preferred_timing || '',
        guardian_name: a.guardian_name,
        guardian_phone: a.guardian_phone,
        status: a.status || 'pending',
        applied_at: a.applied_at || a.created_at,
        reviewed_by: a.reviewed_by,
        reviewed_at: a.reviewed_at,
        notes: a.notes,
        admin_notes: a.admin_notes
      }));
      
      console.log("Fetched admissions:", transformedAdmissions.length, "records");
      setAdmissions(transformedAdmissions);
    } catch (error) {
      console.error("Error fetching admissions:", error);
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      admission.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || admission.status === statusFilter;
    const matchesCourse = courseFilter === "all" || admission.course_name === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAdmissions.length / itemsPerPage);
  const paginatedAdmissions = filteredAdmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: admissions.length,
    pending: admissions.filter((a) => a.status === "pending").length,
    approved: admissions.filter((a) => a.status === "approved").length,
    rejected: admissions.filter((a) => a.status === "rejected").length,
    deferred: admissions.filter((a) => a.status === "deferred").length
  };

  // Modal handlers
  const openDetailModal = (admission: Admission) => {
    setSelectedAdmission(admission);
    setShowDetailModal(true);
  };

  const openActionModal = (admission: Admission, action: "approve" | "reject" | "defer") => {
    setSelectedAdmission(admission);
    setActionType(action);
    setAdminNotes(admission.admin_notes || "");
    setShowActionModal(true);
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowActionModal(false);
    setSelectedAdmission(null);
    setActionType(null);
    setAdminNotes("");
  };

  // Handle action
  const handleAction = async () => {
    if (!selectedAdmission || !actionType) return;

    // Map action type to database status value
    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      defer: 'deferred'
    };
    const newStatus = statusMap[actionType];

    try {
      // Update via API
      const res = await fetch('/api/admin/admissions', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAdmission.id,
          status: newStatus,
          notes: adminNotes
        })
      });

      if (!res.ok) throw new Error('Failed to update admission');

      // Update local state
      setAdmissions((prev) =>
        prev.map((a) =>
          a.id === selectedAdmission.id
            ? {
                ...a,
                status: newStatus as Admission["status"],
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString(),
                admin_notes: adminNotes
              }
            : a
        )
      );

      closeModals();
    } catch (error) {
      console.error("Error updating admission:", error);
      alert("Failed to update admission status. Please try again.");
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      deferred: "bg-blue-100 text-blue-700 border-blue-200"
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      deferred: <Pause className="w-3 h-3" />
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}
      >
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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
                {t("admin.admissions.title") || "Admissions Management"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.admissions.subtitle") || "Review and manage student admission applications"}
              </p>
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors">
                <Download className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.export") || "Export"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: t("admin.admissions.total") || "Total", value: stats.total, icon: ClipboardList, color: "#8B5CF6" },
            { label: t("admin.admissions.pending") || "Pending", value: stats.pending, icon: Clock, color: "#F59E0B" },
            { label: t("admin.admissions.approved") || "Approved", value: stats.approved, icon: CheckCircle, color: "#10B981" },
            { label: t("admin.admissions.rejected") || "Rejected", value: stats.rejected, icon: XCircle, color: "#EF4444" },
            { label: t("admin.admissions.deferred") || "Deferred", value: stats.deferred, icon: Pause, color: "#3B82F6" }
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
                placeholder={t("admin.admissions.searchPlaceholder") || "Search by name, email, or phone..."}
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
                <option value="all">{t("admin.admissions.allStatus") || "All Status"}</option>
                <option value="pending">{t("admin.admissions.pending") || "Pending"}</option>
                <option value="approved">{t("admin.admissions.approved") || "Approved"}</option>
                <option value="rejected">{t("admin.admissions.rejected") || "Rejected"}</option>
                <option value="deferred">{t("admin.admissions.deferred") || "Deferred"}</option>
              </select>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.admissions.allCourses") || "All Courses"}</option>
                {courses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Admissions Table */}
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
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.admissions.table.applicant") || "Applicant"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.admissions.table.course") || "Course"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.admissions.table.country") || "Country"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.admissions.table.applied") || "Applied"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.admissions.table.status") || "Status"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.admissions.table.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {paginatedAdmissions.map((admission) => (
                      <tr key={admission.id} className="hover:bg-[var(--background-green)] transition-colors">
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold">
                              {admission.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{admission.full_name}</p>
                              <p className="text-sm text-[var(--text-muted)]">{admission.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg text-sm ${isRTL ? "arabic-text" : ""}`}>
                            <BookOpen className="w-3 h-3" />
                            {admission.course_name}
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <p className={`text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{admission.country}</p>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <p className="text-sm text-[var(--text-muted)]">{formatDate(admission.applied_at)}</p>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <StatusBadge status={admission.status} />
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <button
                              onClick={() => openDetailModal(admission)}
                              className="p-2 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-[var(--primary)]" />
                            </button>
                            {admission.status === "pending" && (
                              <>
                                <button
                                  onClick={() => openActionModal(admission, "approve")}
                                  className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <UserCheck className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                  onClick={() => openActionModal(admission, "reject")}
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <UserX className="w-4 h-4 text-red-600" />
                                </button>
                                <button
                                  onClick={() => openActionModal(admission, "defer")}
                                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Defer"
                                >
                                  <Pause className="w-4 h-4 text-blue-600" />
                                </button>
                              </>
                            )}
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
                    {Math.min(currentPage * itemsPerPage, filteredAdmissions.length)} {t("admin.of") || "of"} {filteredAdmissions.length}{" "}
                    {t("admin.admissions.results") || "applications"}
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
        {!loading && filteredAdmissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ClipboardList className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className={`text-xl font-semibold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.admissions.noResults") || "No applications found"}
            </h3>
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.admissions.tryDifferent") || "Try adjusting your search or filter criteria"}
            </p>
          </motion.div>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedAdmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={closeModals}
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
                  {t("admin.admissions.applicationDetails") || "Application Details"}
                </h2>
                <button onClick={closeModals} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <XCircle className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Applicant Header */}
                <div className={`flex items-center gap-4 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xl font-bold">
                    {selectedAdmission.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h3 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                      {selectedAdmission.full_name}
                    </h3>
                    <StatusBadge status={selectedAdmission.status} />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Mail className="w-5 h-5 text-[var(--primary)]" />
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.email") || "Email"}</p>
                      <p className="text-[var(--text-primary)]">{selectedAdmission.email}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Phone className="w-5 h-5 text-[var(--primary)]" />
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.phone") || "Phone"}</p>
                      <p className="text-[var(--text-primary)]">{selectedAdmission.phone}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                    <MapPin className="w-5 h-5 text-[var(--primary)]" />
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.country") || "Country"}</p>
                      <p className={`text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedAdmission.country}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                    <User className="w-5 h-5 text-[var(--primary)]" />
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.age") || "Age"}</p>
                      <p className="text-[var(--text-primary)]">{selectedAdmission.age} years</p>
                    </div>
                  </div>
                </div>

                {/* Course Information */}
                <div className="p-4 border border-[var(--border)] rounded-xl">
                  <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                    {t("admin.admissions.courseInfo") || "Course Information"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.appliedCourse") || "Applied Course"}</p>
                      <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedAdmission.course_name}
                      </p>
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.preferredTiming") || "Preferred Timing"}</p>
                      <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedAdmission.preferred_timing}
                      </p>
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.language") || "Preferred Language"}</p>
                      <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedAdmission.language === "en" ? "English" : selectedAdmission.language === "ar" ? "Arabic" : "Urdu"}
                      </p>
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.appliedOn") || "Applied On"}</p>
                      <p className="font-medium text-[var(--text-primary)]">{formatDate(selectedAdmission.applied_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Guardian Information (if minor) */}
                {selectedAdmission.guardian_name && (
                  <div className="p-4 border border-[var(--border)] rounded-xl">
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.admissions.guardianInfo") || "Guardian Information"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.guardianName") || "Guardian Name"}</p>
                        <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                          {selectedAdmission.guardian_name}
                        </p>
                      </div>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.admissions.guardianPhone") || "Guardian Phone"}</p>
                        <p className="font-medium text-[var(--text-primary)]">{selectedAdmission.guardian_phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedAdmission.admin_notes && (
                  <div className="p-4 border border-[var(--border)] rounded-xl">
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.admissions.adminNotes") || "Admin Notes"}
                    </h4>
                    <p className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                      {selectedAdmission.admin_notes}
                    </p>
                    {selectedAdmission.reviewed_at && (
                      <p className={`text-xs text-[var(--text-muted)] mt-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.admissions.reviewedOn") || "Reviewed on"} {formatDate(selectedAdmission.reviewed_at)}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons (for pending applications) */}
                {selectedAdmission.status === "pending" && (
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => {
                        closeModals();
                        openActionModal(selectedAdmission, "approve");
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.admissions.approve") || "Approve"}</span>
                    </button>
                    <button
                      onClick={() => {
                        closeModals();
                        openActionModal(selectedAdmission, "reject");
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <UserX className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.admissions.reject") || "Reject"}</span>
                    </button>
                    <button
                      onClick={() => {
                        closeModals();
                        openActionModal(selectedAdmission, "defer");
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.admissions.defer") || "Defer"}</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Modal */}
      <AnimatePresence>
        {showActionModal && selectedAdmission && actionType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl w-full max-w-md overflow-y-auto"
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {actionType === "approve"
                    ? t("admin.admissions.approveApplication") || "Approve Application"
                    : actionType === "reject"
                    ? t("admin.admissions.rejectApplication") || "Reject Application"
                    : t("admin.admissions.deferApplication") || "Defer Application"}
                </h2>
                <button onClick={closeModals} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <XCircle className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Applicant Info */}
                <div className={`flex items-center gap-3 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                    {selectedAdmission.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className={`font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                      {selectedAdmission.full_name}
                    </p>
                    <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                      {selectedAdmission.course_name}
                    </p>
                  </div>
                </div>

                {/* Action-specific message */}
                <div className={`p-4 rounded-xl ${
                  actionType === "approve"
                    ? "bg-green-50 border border-green-200"
                    : actionType === "reject"
                    ? "bg-red-50 border border-red-200"
                    : "bg-blue-50 border border-blue-200"
                }`}>
                  <p className={`text-sm ${
                    actionType === "approve"
                      ? "text-green-700"
                      : actionType === "reject"
                      ? "text-red-700"
                      : "text-blue-700"
                  } ${isRTL ? "arabic-text" : ""}`}>
                    {actionType === "approve"
                      ? t("admin.admissions.approveMessage") || "This will approve the application and auto-assign a teacher. The student will be notified via email."
                      : actionType === "reject"
                      ? t("admin.admissions.rejectMessage") || "This will reject the application. The applicant will be notified via email."
                      : t("admin.admissions.deferMessage") || "This will defer the application for later review. The applicant will be notified via email."}
                  </p>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("admin.admissions.addNotes") || "Add Notes (Optional)"}
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    placeholder={t("admin.admissions.notesPlaceholder") || "Enter any notes about this decision..."}
                    className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none ${isRTL ? "arabic-text" : ""}`}
                  />
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={handleAction}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                      actionType === "approve"
                        ? "bg-green-500 hover:bg-green-600"
                        : actionType === "reject"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {actionType === "approve" ? (
                      <UserCheck className="w-4 h-4" />
                    ) : actionType === "reject" ? (
                      <UserX className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    <span className={isRTL ? "arabic-text" : ""}>
                      {actionType === "approve"
                        ? t("admin.admissions.confirmApprove") || "Confirm Approval"
                        : actionType === "reject"
                        ? t("admin.admissions.confirmReject") || "Confirm Rejection"
                        : t("admin.admissions.confirmDefer") || "Confirm Deferral"}
                    </span>
                  </button>
                  <button
                    onClick={closeModals}
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
