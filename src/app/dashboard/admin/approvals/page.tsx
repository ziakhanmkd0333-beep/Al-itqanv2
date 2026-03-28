"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import {
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  FileText,
  X
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface PendingUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  age?: number;
  specialization?: string;
  qualifications?: string;
  created_at: string;
  status: string;
  type: 'student' | 'teacher';
}

export default function ApprovalsPage() {
  return (
    <AdminRoute>
      <ApprovalsContent />
    </AdminRoute>
  );
}

function ApprovalsContent() {
  const { t } = useTranslation();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'student' | 'teacher'>('all');
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/admin/approve', { credentials: 'include' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch pending users');
      }

      // Combine students and teachers with type indicator
      const users: PendingUser[] = [
        ...(data.pendingStudents || []).map((s: any) => ({ ...s, type: 'student' as const })),
        ...(data.pendingTeachers || []).map((t: any) => ({ ...t, type: 'teacher' as const }))
      ];

      // Sort by created_at
      users.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      setPendingUsers(users);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleAction = async (userId: string, userType: 'student' | 'teacher', action: 'approve' | 'reject') => {
    setProcessing(userId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userType,
          action
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} user`);
      }

      setSuccess(`User ${action}d successfully`);
      
      // Remove the user from the list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      setError(err.message || `Failed to ${action} user`);
    } finally {
      setProcessing(null);
    }
  };

  const filteredUsers = filter === 'all' 
    ? pendingUsers 
    : pendingUsers.filter(u => u.type === filter);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="admin" />
      
      <main className="flex-1 p-6 lg:p-8 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Pending Approvals
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Review and approve new student and teacher registrations
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchPendingUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['all', 'student', 'teacher'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === type
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--card)] text-[var(--text-secondary)] hover:bg-[var(--muted)]'
                }`}
              >
                {type === 'all' ? 'All' : type === 'student' ? 'Students' : 'Teachers'}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                  {type === 'all' 
                    ? pendingUsers.length 
                    : pendingUsers.filter(u => u.type === type).length}
                </span>
              </button>
            ))}
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-600"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-600"
            >
              <CheckCircle className="w-5 h-5" />
              {success}
            </motion.div>
          )}

          {/* Pending Users List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto text-[var(--text-secondary)] mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-primary)]">No pending approvals</h3>
              <p className="text-[var(--text-secondary)] mt-1">
                All registrations have been processed
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.type === 'student' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          {user.type === 'student' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <GraduationCap className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">
                            {user.full_name}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            user.type === 'student'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-purple-500/10 text-purple-500'
                          }`}>
                            {user.type === 'student' ? 'Student' : 'Teacher'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        )}
                        {user.country && (
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <MapPin className="w-4 h-4" />
                            {user.country}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {user.type === 'teacher' && user.specialization && (
                        <div className="mt-3 text-sm text-[var(--text-secondary)]">
                          <strong>Specialization:</strong> {user.specialization}
                        </div>
                      )}
                      
                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="mt-3 flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(user.id, user.type, 'approve')}
                        disabled={processing === user.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {processing === user.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(user.id, user.type, 'reject')}
                        disabled={processing === user.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--card)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Registration Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-[var(--muted)] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedUser.type === 'student' 
                      ? 'bg-blue-500/10 text-blue-500' 
                      : 'bg-purple-500/10 text-purple-500'
                  }`}>
                    {selectedUser.type === 'student' ? (
                      <Users className="w-6 h-6" />
                    ) : (
                      <GraduationCap className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{selectedUser.full_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedUser.type === 'student'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {selectedUser.type === 'student' ? 'Student' : 'Teacher'}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-lg">
                    <Mail className="w-5 h-5 text-[var(--primary)]" />
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Email</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.email}</p>
                    </div>
                  </div>

                  {selectedUser.phone && (
                    <div className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-lg">
                      <Phone className="w-5 h-5 text-[var(--primary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Phone</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.country && (
                    <div className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-lg">
                      <MapPin className="w-5 h-5 text-[var(--primary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Country</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.country}</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.age && (
                    <div className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-lg">
                      <Calendar className="w-5 h-5 text-[var(--primary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Age</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.age} years</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.specialization && (
                    <div className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-lg">
                      <FileText className="w-5 h-5 text-[var(--primary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Specialization</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.specialization}</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.qualifications && (
                    <div className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-lg">
                      <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Qualifications</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.qualifications}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-lg">
                    <Clock className="w-5 h-5 text-[var(--primary)]" />
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Registered</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {new Date(selectedUser.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => {
                      handleAction(selectedUser.id, selectedUser.type, 'approve');
                      setSelectedUser(null);
                    }}
                    disabled={processing === selectedUser.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {processing === selectedUser.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleAction(selectedUser.id, selectedUser.type, 'reject');
                      setSelectedUser(null);
                    }}
                    disabled={processing === selectedUser.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
