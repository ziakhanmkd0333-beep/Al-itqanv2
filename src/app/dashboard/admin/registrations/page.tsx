"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRegistrations } from "@/hooks/use-realtime-data";
import {
  Users,
  GraduationCap,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Types
interface Registration {
  id: string;
  user_type: 'student' | 'teacher';
  full_name: string;
  email: string;
  phone: string;
  country: string;
  age?: number;
  language?: string;
  guardian_name?: string;
  guardian_phone?: string;
  course_id?: string;
  preferred_timing?: string;
  start_date?: string;
  specialization?: string;
  qualifications?: string;
  experience_years?: number;
  bio?: string;
  cv_url?: string;
  certification_url?: string;
  languages_known?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'inactive' | 'suspended';
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  original_id: string;
  created_at: string;
  updated_at: string;
  courses?: { title: string };
}

export default function AdminRegistrationsPage() {
  return (
    <AdminRoute>
      <AdminRegistrationsContent />
    </AdminRoute>
  );
}

function AdminRegistrationsContent() {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Modal states
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string | number | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch registrations
  const {
    registrations,
    total,
    loading,
    error,
    refetch,
    updateRegistration,
    deleteRegistration,
    approveRegistration,
    rejectRegistration
  } = useAdminRegistrations(page, 15, {
    status: statusFilter || undefined,
    userType: userTypeFilter || undefined,
    search: debouncedSearch || undefined
  });

  const totalPages = Math.ceil(total / 15);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle edit
  const handleEdit = (registration: Registration) => {
    setSelectedRegistration(registration);
    setEditForm({
      full_name: registration.full_name,
      email: registration.email,
      phone: registration.phone,
      country: registration.country,
      age: registration.age || '',
      language: registration.language || 'en',
      guardian_name: registration.guardian_name || '',
      guardian_phone: registration.guardian_phone || '',
      preferred_timing: registration.preferred_timing || '',
      start_date: registration.start_date || '',
      specialization: registration.specialization || '',
      qualifications: registration.qualifications || '',
      experience_years: registration.experience_years || '',
      bio: registration.bio || '',
      admin_notes: registration.admin_notes || ''
    });
    setEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!selectedRegistration) return;
    
    setIsSubmitting(true);
    try {
      await updateRegistration(selectedRegistration.id, editForm);
      showNotification('success', 'Registration updated successfully');
      setEditModal(false);
      setSelectedRegistration(null);
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to update registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedRegistration) return;
    
    setIsSubmitting(true);
    try {
      await deleteRegistration(selectedRegistration.id);
      showNotification('success', 'Registration deleted successfully');
      setDeleteModal(false);
      setSelectedRegistration(null);
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to delete registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle approve
  const handleApprove = async (registration: Registration) => {
    try {
      await approveRegistration(registration.id, user?.id || '', 'Approved by admin');
      showNotification('success', `${registration.user_type === 'student' ? 'Student' : 'Teacher'} approved successfully`);
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to approve registration');
    }
  };

  // Handle reject
  const handleReject = async (registration: Registration) => {
    try {
      await rejectRegistration(registration.id, user?.id || '', 'Rejected by admin');
      showNotification('success', `${registration.user_type === 'student' ? 'Student' : 'Teacher'} rejected`);
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to reject registration');
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
      suspended: "bg-orange-100 text-orange-700 border-orange-200"
    };
    
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      approved: CheckCircle,
      rejected: XCircle,
      pending: Clock,
      inactive: Users,
      suspended: AlertTriangle
    };
    
    const Icon = icons[status] || Clock;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Stats calculation
  const stats = useMemo(() => {
    const pending = registrations.filter(r => r.status === 'pending').length;
    const approved = registrations.filter(r => r.status === 'approved').length;
    const rejected = registrations.filter(r => r.status === 'rejected').length;
    const students = registrations.filter(r => r.user_type === 'student').length;
    const teachers = registrations.filter(r => r.user_type === 'teacher').length;
    return { pending, approved, rejected, students, teachers, total };
  }, [registrations, total]);

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
                {t("admin.registrations") || "Registrations Management"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.registrationsDesc") || "Manage all student and teacher registrations"}
              </p>
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => refetch()}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-card border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors disabled:opacity-50 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span className={isRTL ? "arabic-text" : ""}>{loading ? "Loading..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "#6B7280" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "#F59E0B", alert: stats.pending > 0 },
            { label: "Approved", value: stats.approved, icon: CheckCircle, color: "#10B981" },
            { label: "Students", value: stats.students, icon: Users, color: "#3B82F6" },
            { label: "Teachers", value: stats.teachers, icon: GraduationCap, color: "#8B5CF6" }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card p-4 rounded-xl border ${stat.alert ? "border-yellow-300 bg-yellow-50/50" : "border-[var(--border)]"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                </div>
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  {stat.alert && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-[var(--border)] p-4 mb-6"
        >
          <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] ${isRTL ? "right-3" : "left-3"}`} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-4 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)]`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-4 focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* User Type Filter */}
            <select
              value={userTypeFilter}
              onChange={(e) => { setUserTypeFilter(e.target.value); setPage(1); }}
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-4 focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)]"
            >
              <option value="">All Types</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
            </select>
          </div>
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-[var(--border)] overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-red-500">
              <AlertTriangle className="w-6 h-6 mr-2" />
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <Users className="w-12 h-12 mb-4 opacity-50" />
              <p>No registrations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--background)]">
                  <tr className="border-b border-[var(--border)]">
                    <th className={`px-4 py-3 text-left font-semibold text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>Name</th>
                    <th className={`px-4 py-3 font-semibold text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>Email</th>
                    <th className={`px-4 py-3 font-semibold text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>Phone</th>
                    <th className={`px-4 py-3 font-semibold text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>Type</th>
                    <th className={`px-4 py-3 font-semibold text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>Status</th>
                    <th className={`px-4 py-3 font-semibold text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>Date</th>
                    <th className={`px-4 py-3 font-semibold text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {registrations.map((registration: Registration) => (
                    <tr key={registration.id} className="hover:bg-[var(--background)] transition-colors">
                      <td className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${registration.user_type === 'student' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                            {registration.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{registration.full_name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{registration.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>{registration.email}</td>
                      <td className={`px-4 py-3 text-[var(--text-secondary)] ${isRTL ? "text-right" : "text-left"}`}>{registration.phone}</td>
                      <td className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${registration.user_type === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {registration.user_type === 'student' ? <Users className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                          {registration.user_type.charAt(0).toUpperCase() + registration.user_type.slice(1)}
                        </span>
                      </td>
                      <td className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}>
                        <StatusBadge status={registration.status} />
                      </td>
                      <td className={`px-4 py-3 text-[var(--text-muted)] text-sm ${isRTL ? "text-right" : "text-left"}`}>
                        {new Date(registration.created_at).toLocaleDateString()}
                      </td>
                      <td className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <button
                            onClick={() => { setSelectedRegistration(registration); setViewModal(true); }}
                            className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-[var(--text-muted)]" />
                          </button>
                          <button
                            onClick={() => handleEdit(registration)}
                            className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                          </button>
                          {registration.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(registration)}
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </button>
                              <button
                                onClick={() => handleReject(registration)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4 text-red-500" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => { setSelectedRegistration(registration); setDeleteModal(true); }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-4 py-3 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
              <p className="text-sm text-[var(--text-muted)]">
                Showing {((page - 1) * 15) + 1} to {Math.min(page * 15, total)} of {total} results
              </p>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* View Modal */}
      <AnimatePresence>
        {viewModal && selectedRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className={`p-6 border-b border-[var(--border)] flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  Registration Details
                </h2>
                <button onClick={() => setViewModal(false)} className="p-2 hover:bg-[var(--background)] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Header Info */}
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${selectedRegistration.user_type === 'student' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                    {selectedRegistration.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{selectedRegistration.full_name}</h3>
                    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <StatusBadge status={selectedRegistration.status} />
                      <span className={`text-xs px-2 py-1 rounded-full ${selectedRegistration.user_type === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {selectedRegistration.user_type.charAt(0).toUpperCase() + selectedRegistration.user_type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`flex items-center gap-3 p-3 bg-[var(--background)] rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Mail className="w-5 h-5 text-[var(--primary)]" />
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-xs text-[var(--text-muted)]">Email</p>
                      <p className="text-sm text-[var(--text-primary)]">{selectedRegistration.email}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-[var(--background)] rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Phone className="w-5 h-5 text-[var(--primary)]" />
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-xs text-[var(--text-muted)]">Phone</p>
                      <p className="text-sm text-[var(--text-primary)]">{selectedRegistration.phone}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-[var(--background)] rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                    <MapPin className="w-5 h-5 text-[var(--primary)]" />
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-xs text-[var(--text-muted)]">Country</p>
                      <p className="text-sm text-[var(--text-primary)]">{selectedRegistration.country}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-[var(--background)] rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Calendar className="w-5 h-5 text-[var(--primary)]" />
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-xs text-[var(--text-muted)]">Registered</p>
                      <p className="text-sm text-[var(--text-primary)]">{new Date(selectedRegistration.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Student-specific fields */}
                {selectedRegistration.user_type === 'student' && (
                  <>
                    {selectedRegistration.age && (
                      <div className="p-4 bg-[var(--background)] rounded-lg">
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Age: {selectedRegistration.age}</p>
                        {selectedRegistration.courses?.title && (
                          <p className="text-sm text-[var(--text-muted)]">Course: {selectedRegistration.courses.title}</p>
                        )}
                        {selectedRegistration.preferred_timing && (
                          <p className="text-sm text-[var(--text-muted)]">Preferred Timing: {selectedRegistration.preferred_timing}</p>
                        )}
                      </div>
                    )}
                    {(selectedRegistration.guardian_name || selectedRegistration.guardian_phone) && (
                      <div className="p-4 bg-[var(--background)] rounded-lg">
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Guardian Information</p>
                        {selectedRegistration.guardian_name && (
                          <p className="text-sm text-[var(--text-muted)]">Name: {selectedRegistration.guardian_name}</p>
                        )}
                        {selectedRegistration.guardian_phone && (
                          <p className="text-sm text-[var(--text-muted)]">Phone: {selectedRegistration.guardian_phone}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Teacher-specific fields */}
                {selectedRegistration.user_type === 'teacher' && (
                  <div className="space-y-4">
                    {selectedRegistration.specialization && (
                      <div className="p-4 bg-[var(--background)] rounded-lg">
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Award className="w-5 h-5 text-[var(--primary)]" />
                          <p className="text-sm font-semibold text-[var(--text-primary)]">Specialization</p>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">{selectedRegistration.specialization}</p>
                      </div>
                    )}
                    {selectedRegistration.qualifications && (
                      <div className="p-4 bg-[var(--background)] rounded-lg">
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Qualifications</p>
                        <p className="text-sm text-[var(--text-muted)]">{selectedRegistration.qualifications}</p>
                      </div>
                    )}
                    {selectedRegistration.experience_years !== null && selectedRegistration.experience_years !== undefined && (
                      <div className="p-4 bg-[var(--background)] rounded-lg">
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Experience: {selectedRegistration.experience_years} years</p>
                      </div>
                    )}
                    {selectedRegistration.languages_known && selectedRegistration.languages_known.length > 0 && (
                      <div className="p-4 bg-[var(--background)] rounded-lg">
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Languages Known</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegistration.languages_known.map((lang, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{lang}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(selectedRegistration.cv_url || selectedRegistration.certification_url) && (
                      <div className="p-4 bg-[var(--background)] rounded-lg">
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Documents</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegistration.cv_url && (
                            <a href={selectedRegistration.cv_url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                              View CV
                            </a>
                          )}
                          {selectedRegistration.certification_url && (
                            <a href={selectedRegistration.certification_url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                              View Certification
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Notes */}
                {selectedRegistration.admin_notes && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-800 mb-1">Admin Notes</p>
                    <p className="text-sm text-yellow-700">{selectedRegistration.admin_notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedRegistration.status === 'pending' && (
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => { handleApprove(selectedRegistration); setViewModal(false); }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => { handleReject(selectedRegistration); setViewModal(false); }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && selectedRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className={`p-6 border-b border-[var(--border)] flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  Edit Registration
                </h2>
                <button onClick={() => setEditModal(false)} className="p-2 hover:bg-[var(--background)] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.full_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Country</label>
                    <input
                      type="text"
                      value={editForm.country || ''}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  {selectedRegistration.user_type === 'student' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Age</label>
                        <input
                          type="number"
                          value={editForm.age || ''}
                          onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Preferred Timing</label>
                        <input
                          type="text"
                          value={editForm.preferred_timing || ''}
                          onChange={(e) => setEditForm({ ...editForm, preferred_timing: e.target.value })}
                          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Guardian Name</label>
                        <input
                          type="text"
                          value={editForm.guardian_name || ''}
                          onChange={(e) => setEditForm({ ...editForm, guardian_name: e.target.value })}
                          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Guardian Phone</label>
                        <input
                          type="text"
                          value={editForm.guardian_phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, guardian_phone: e.target.value })}
                          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </>
                  )}
                  {selectedRegistration.user_type === 'teacher' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Specialization</label>
                        <input
                          type="text"
                          value={editForm.specialization || ''}
                          onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Experience (Years)</label>
                        <input
                          type="number"
                          value={editForm.experience_years || ''}
                          onChange={(e) => setEditForm({ ...editForm, experience_years: e.target.value })}
                          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Admin Notes</label>
                  <textarea
                    value={editForm.admin_notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                    rows={3}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Add notes about this registration..."
                  />
                </div>
              </div>

              <div className={`p-6 border-t border-[var(--border)] flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  onClick={() => setEditModal(false)}
                  className="flex-1 px-4 py-3 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && selectedRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-[var(--border)] w-full max-w-md"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Delete Registration?</h3>
                <p className="text-[var(--text-muted)] mb-6">
                  Are you sure you want to delete the registration for <strong>{selectedRegistration.full_name}</strong>? 
                  This action cannot be undone and will also remove the associated {selectedRegistration.user_type} account.
                </p>
                <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="flex-1 px-4 py-3 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    Delete
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
