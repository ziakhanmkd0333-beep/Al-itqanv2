"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import {
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Building,
  BookOpen,
  Shield,
  Clock,
  FileText,
  X,
  Flag,
  RefreshCw
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Types
interface IslamicQualification {
  nazira_enabled: boolean;
  nazira_details: string;
  nazira_institution: string;
  nazira_completion_year: number;
  hifz_enabled: boolean;
  hifz_details: string;
  hifz_institution: string;
  hifz_completion_year: number;
  hifz_juz_count: number;
  tarjama_enabled: boolean;
  tarjama_details: string;
  tarjama_institution: string;
  tarjama_completion_year: number;
  tafseer_enabled: boolean;
  tafseer_details: string;
  tafseer_institution: string;
  tafseer_completion_year: number;
}

interface PreviousEducation {
  id: string;
  education_type: string;
  institution_name: string;
  degree_title: string;
  completion_year: number;
}

interface RoleSpecificInfo {
  current_class_grade?: string;
  school_institute_name?: string;
  school_name?: string;
  teaching_subject?: string;
  years_of_experience?: string;
  mosque_name?: string;
  mosque_city?: string;
  mosque_address?: string;
  years_serving?: string;
  madrasa_name?: string;
  madrasa_city?: string;
  madrasa_address?: string;
  subjects_teaching?: string[];
}

interface Application {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  full_address: string;
  profile_picture_url: string;
  role: "student" | "teacher" | "imam" | "mudarris";
  status: "pending" | "approved" | "rejected" | "flagged";
  is_approved: boolean;
  is_flagged: boolean;
  flag_reason: string;
  submitted_from_ip: string;
  created_at: string;
  guardian_name?: string;
  guardian_phone?: string;
  academic_details?: string;
  school_name?: string;
  mosque_name?: string;
  madrasa_name?: string;
  islamic_qualifications?: IslamicQualification;
  previous_education?: PreviousEducation[];
  role_info?: RoleSpecificInfo;
}

export default function EnhancedApprovalsPage() {
  return (
    <AdminRoute>
      <EnhancedApprovalsContent />
    </AdminRoute>
  );
}

function EnhancedApprovalsContent() {
  const { t: _t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/enhanced-approvals", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load applications";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesRole = roleFilter === "all" || app.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handle approve/reject
  const handleAction = async (
    applicationId: string,
    action: "approve" | "reject",
    notes: string = ""
  ) => {
    setActionLoading(applicationId);
    try {
      const response = await fetch(`/api/admin/enhanced-approvals/${applicationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, notes }),
      });

      if (!response.ok) throw new Error("Failed to process action");

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                status: action === "approve" ? "approved" : "rejected",
                is_approved: action === "approve",
              }
            : app
        )
      );

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication((prev) =>
          prev
            ? {
                ...prev,
                status: action === "approve" ? "approved" : "rejected",
                is_approved: action === "approve",
              }
            : null
        );
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process action";
      setError(errorMessage);
    } finally {
      setActionLoading(null);
      setReviewNotes("");
    }
  };

  // Get status badge
  const getStatusBadge = (status: string, isFlagged: boolean) => {
    if (isFlagged) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <Flag className="w-4 h-4" />
          Flagged
        </span>
      );
    }
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-5 h-5" />;
      case "teacher":
        return <Briefcase className="w-5 h-5" />;
      case "imam":
        return <Building className="w-5 h-5" />;
      case "mudarris":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  // Get role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student":
        return "Student";
      case "teacher":
        return "Teacher";
      case "imam":
        return "Imam / Khateeb";
      case "mudarris":
        return "Mudarris";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar userType="admin" />

      <div className="lg:ml-72 min-h-screen">
        <main className="p-4 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Enhanced Admission Approvals
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and approve student and teacher applications with detailed information
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                label: "Pending",
                value: applications.filter((a) => a.status === "pending").length,
                color: "yellow",
              },
              {
                label: "Flagged",
                value: applications.filter((a) => a.is_flagged).length,
                color: "red",
              },
              {
                label: "Approved",
                value: applications.filter((a) => a.status === "approved").length,
                color: "green",
              },
              {
                label: "Rejected",
                value: applications.filter((a) => a.status === "rejected").length,
                color: "gray",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="imam">Imam / Khateeb</option>
                <option value="mudarris">Mudarris</option>
              </select>
              <button
                onClick={fetchApplications}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Applications Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      </td>
                    </tr>
                  ) : filteredApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {app.profile_picture_url ? (
                              <Image
                                src={app.profile_picture_url}
                                alt={app.full_name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <User className="w-5 h-5 text-emerald-600" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {app.full_name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {app.country}, {app.city}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              {getRoleIcon(app.role)}
                            </div>
                            <span className="text-gray-900 dark:text-white">
                              {getRoleLabel(app.role)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {app.email}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {app.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(app.status, app.is_flagged)}
                          {app.is_flagged && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {app.flag_reason}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setShowDetailModal(true);
                              }}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {app.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleAction(app.id, "approve")}
                                  disabled={actionLoading === app.id}
                                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  {actionLoading === app.id ? (
                                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-5 h-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleAction(app.id, "reject")}
                                  disabled={actionLoading === app.id}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectedApplication.profile_picture_url ? (
                    <Image
                      src={selectedApplication.profile_picture_url}
                      alt={selectedApplication.full_name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <User className="w-8 h-8 text-emerald-600" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedApplication.full_name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedApplication.status, selectedApplication.is_flagged)}
                      <span className="text-gray-500 dark:text-gray-400">
                        {getRoleLabel(selectedApplication.role)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-gray-900 dark:text-white">{selectedApplication.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-gray-900 dark:text-white">{selectedApplication.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                          <p className="text-gray-900 dark:text-white">
                            {selectedApplication.full_address}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedApplication.city}, {selectedApplication.country}
                          </p>
                        </div>
                      </div>
                      {selectedApplication.guardian_name && (
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Guardian</p>
                            <p className="text-gray-900 dark:text-white">
                              {selectedApplication.guardian_name} ({selectedApplication.guardian_phone})
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Role Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {getRoleIcon(selectedApplication.role)}
                      {getRoleLabel(selectedApplication.role)} Information
                    </h3>
                    <div className="space-y-3">
                      {selectedApplication.role === "student" && (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Class/Grade:</span>{" "}
                            {selectedApplication.role_info?.current_class_grade || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">School/Institute:</span>{" "}
                            {selectedApplication.role_info?.school_institute_name || "N/A"}
                          </p>
                        </>
                      )}
                      {selectedApplication.role === "teacher" && (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">School:</span>{" "}
                            {selectedApplication.school_name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Subject:</span>{" "}
                            {selectedApplication.role_info?.teaching_subject || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Experience:</span>{" "}
                            {selectedApplication.role_info?.years_of_experience || "N/A"}
                          </p>
                        </>
                      )}
                      {selectedApplication.role === "imam" && (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Mosque:</span>{" "}
                            {selectedApplication.mosque_name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Location:</span>{" "}
                            {selectedApplication.role_info?.mosque_city || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Years Serving:</span>{" "}
                            {selectedApplication.role_info?.years_serving || "N/A"}
                          </p>
                        </>
                      )}
                      {selectedApplication.role === "mudarris" && (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Madrasa:</span>{" "}
                            {selectedApplication.madrasa_name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Subjects:</span>{" "}
                            {selectedApplication.role_info?.subjects_teaching?.join(", ") || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Experience:</span>{" "}
                            {selectedApplication.role_info?.years_of_experience || "N/A"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Islamic Education Qualifications */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      Islamic Education Qualifications
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedApplication.islamic_qualifications?.nazira_enabled && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <p className="font-medium text-emerald-700 dark:text-emerald-400">Nazira</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedApplication.islamic_qualifications.nazira_institution || "N/A"}
                          </p>
                          {selectedApplication.islamic_qualifications.nazira_completion_year && (
                            <p className="text-xs text-gray-500">
                              {selectedApplication.islamic_qualifications.nazira_completion_year}
                            </p>
                          )}
                        </div>
                      )}
                      {selectedApplication.islamic_qualifications?.hifz_enabled && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <p className="font-medium text-emerald-700 dark:text-emerald-400">Hifz</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedApplication.islamic_qualifications.hifz_institution || "N/A"}
                          </p>
                          {selectedApplication.islamic_qualifications.hifz_juz_count && (
                            <p className="text-xs text-gray-500">
                              {selectedApplication.islamic_qualifications.hifz_juz_count} Juz
                            </p>
                          )}
                        </div>
                      )}
                      {selectedApplication.islamic_qualifications?.tarjama_enabled && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <p className="font-medium text-emerald-700 dark:text-emerald-400">Tarjama</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedApplication.islamic_qualifications.tarjama_institution || "N/A"}
                          </p>
                        </div>
                      )}
                      {selectedApplication.islamic_qualifications?.tafseer_enabled && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <p className="font-medium text-emerald-700 dark:text-emerald-400">Tafseer</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedApplication.islamic_qualifications.tafseer_institution || "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Previous Education */}
                  {selectedApplication.previous_education &&
                    selectedApplication.previous_education.length > 0 && (
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-emerald-600" />
                          Previous Education
                        </h3>
                        <div className="space-y-3">
                          {selectedApplication.previous_education.map((edu) => (
                            <div
                              key={edu.id}
                              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <FileText className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {edu.institution_name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {edu.degree_title} • {edu.education_type} • {edu.completion_year}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Fraud Detection */}
                  {selectedApplication.is_flagged && (
                    <div className="md:col-span-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700 dark:text-red-400">
                            Flagged for Review
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {selectedApplication.flag_reason}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            IP: {selectedApplication.submitted_from_ip}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Review Notes (optional)
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Add notes about this application..."
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    {selectedApplication.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            handleAction(selectedApplication.id, "reject", reviewNotes);
                            setShowDetailModal(false);
                          }}
                          disabled={actionLoading === selectedApplication.id}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleAction(selectedApplication.id, "approve", reviewNotes);
                            setShowDetailModal(false);
                          }}
                          disabled={actionLoading === selectedApplication.id}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          {actionLoading === selectedApplication.id ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
