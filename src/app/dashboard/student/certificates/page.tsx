"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import {
  Award,
  Download,
  Share2,
  Eye,
  X,
  Printer,
  CheckCircle,
  Clock,
  RefreshCw,
  BookOpen,
  FileText,
  Calendar,
  User,
  Lock
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useStudentCertificates, useStudentDashboard } from "@/hooks/use-realtime-data";
import { getCurrentUser, getStudentProfile } from "@/lib/supabase-browser";

export default function StudentCertificatesPage() {
  return (
    <StudentRoute>
      <StudentCertificatesContent />
    </StudentRoute>
  );
}

function StudentCertificatesContent() {
  const { t, isRTL } = useTranslation();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Get student ID from profile on mount
  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      if (user?.id) {
        if (user.role === 'student' || !user.role) {
          const profile = await getStudentProfile(user.id);
          if (profile?.id) {
            setStudentId(profile.id);
          }
        } else {
          setStudentId(user.id);
        }
      }
    }
    loadProfile();
  }, []);

  // Use real-time hooks for certificates and dashboard data
  const { certificates, loading: certsLoading } = useStudentCertificates(studentId);
  const { enrollments, loading: enrollmentsLoading } = useStudentDashboard(studentId);

  const handleViewCertificate = (cert: any) => {
    setSelectedCertificate(cert);
    setShowPreviewModal(true);
  };

  const handleDownload = (cert: any) => {
    alert(`Downloading certificate: ${cert.title}`);
  };

  const handlePrint = (cert: any) => {
    alert(`Printing certificate: ${cert.title}`);
  };

  const handleShare = (cert: any) => {
    alert(`Sharing certificate: ${cert.title}`);
  };

  const loading = certsLoading || enrollmentsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardSidebar userType="student" />
        <main className={`p-6 ${isRTL ? "mr-64" : "ml-64"}`}>
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        </main>
      </div>
    );
  }

  // Transform certificates data
  const earnedCertificates = certificates.filter((c: any) => c.status === 'active' || c.status === 'completed');
  const inProgressCerts = enrollments
    .filter((e: any) => e.progress > 0 && e.progress < 100)
    .map((e: any) => ({
      id: e.id,
      course: e.course_title || e.course?.title,
      progress: e.progress,
      remaining: `${100 - e.progress}% remaining`,
      estimatedCompletion: e.estimated_completion || 'TBD'
    }));

  // Calculate stats
  const totalEarned = earnedCertificates.length;
  const inProgress = inProgressCerts.length;
  const avgGrade = earnedCertificates.length > 0 
    ? earnedCertificates[0]?.grade || 'A'
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar userType="student" />

      <main className={`p-6 ${isRTL ? "mr-64" : "ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Award className="w-8 h-8 text-emerald-600" />
              My Certificates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and download your course completion certificates
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEarned}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Earned</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{inProgress}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{enrollments.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgGrade}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Grade</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earned Certificates */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    Earned Certificates
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {earnedCertificates.map((cert: any, index: number) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Certificate Icon */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Award className="w-8 h-8 text-white" />
                        </div>

                        {/* Certificate Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{cert.title || cert.course_title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{cert.course}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                              Grade: {cert.grade || 'A'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Issued: {cert.issue_date || cert.issued_at || new Date().toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {cert.teacher || 'Teacher'}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              ID: {cert.certificate_id || `CERT-${cert.id}`}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(cert)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handlePrint(cert)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                            title="Print"
                          >
                            <Printer className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleShare(cert)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {earnedCertificates.length === 0 && (
                  <div className="p-8 text-center">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No certificates earned yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Complete courses to earn certificates</p>
                  </div>
                )}
              </div>

              {/* In Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    In Progress
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {inProgressCerts.map((cert: any, index: number) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {cert.progress > 0 ? (
                            <Clock className="w-6 h-6 text-gray-400" />
                          ) : (
                            <Lock className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{cert.course}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{cert.progress}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-500 rounded-full"
                                  style={{ width: `${cert.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Est. {cert.estimatedCompletion}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {inProgressCerts.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No courses in progress
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Certificate Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About Certificates</h2>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Certificates are awarded upon successful completion of each course. They include:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Your name and the course completed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Issue date and unique certificate ID</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Teacher's signature and credentials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Academy seal and verification QR</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Verification */}
              <div className="bg-emerald-600 rounded-xl p-6 text-white">
                <h2 className="text-lg font-bold mb-3">Certificate Verification</h2>
                <p className="text-sm text-white/90 mb-4">
                  Each certificate has a unique ID that can be verified on our website for authenticity.
                </p>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-white/70">Example ID</p>
                  <p className="font-mono text-sm">CERT-NQ-2025-001</p>
                </div>
              </div>

              {/* Download All */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Download All</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Download all your certificates as a single ZIP file.
                </p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  <Download className="w-5 h-5" />
                  Download All Certificates
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Certificate Preview Modal */}
      {showPreviewModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Certificate Preview</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Certificate Design */}
              <div className="border-4 border-emerald-600 rounded-xl p-8 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-600 mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Certificate of Completion</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">*الإتقان للدراسات الإسلامية والعربية* Al-Itqan Institute for Islamic & Arabic Studies</p>
                </div>

                {/* Content */}
                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">This is to certify that</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">Ahmed Khan</p>
                  <p className="text-gray-600 dark:text-gray-400">has successfully completed the course</p>
                  <p className="text-2xl font-semibold text-emerald-600">{selectedCertificate.title}</p>
                  
                  <div className="py-4">
                    <p className="text-gray-600 dark:text-gray-400">with grade</p>
                    <p className="text-4xl font-bold text-emerald-600">{selectedCertificate.grade}</p>
                  </div>

                  <div className="flex justify-center gap-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Issue Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCertificate.issueDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Certificate ID</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white">{selectedCertificate.certificateId}</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedCertificate.teacher}</p>
                    <p className="text-xs text-gray-400 mt-1">Scholar Supervisor</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleDownload(selectedCertificate)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={() => handlePrint(selectedCertificate)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
