"use client";

import { useState } from "react";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AdminCard,
  AdminTable,
  StatusBadge,
  ActionButtons,
  PageHeader,
  EmptyState,
  LoadingSkeleton,
  AdminModal,
} from "@/components/admin";
import {
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { useToast } from "@/hooks";

interface PendingUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  age?: number;
  city?: string;
  full_address?: string;
  academic_details?: string;
  specialization?: string;
  qualifications?: string;
  created_at: string;
  status: string;
  type: 'student' | 'teacher';
}

const typeOptions = [
  { value: "all", label: "All" },
  { value: "student", label: "Students" },
  { value: "teacher", label: "Teachers" },
];

export default function ApprovalsPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <ApprovalsContent />
      </AdminLayout>
    </AdminRoute>
  );
}

function ApprovalsContent() {
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewUser, setViewUser] = useState<PendingUser | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const filteredUsers = typeFilter === "all"
    ? pendingUsers
    : pendingUsers.filter((u) => u.type === typeFilter);

  const columns = [
    {
      key: "name",
      header: "Applicant",
      render: (user: PendingUser) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            user.type === 'student' ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-green-100 dark:bg-green-900/30'
          }`}>
            {user.type === 'student' ? (
              <Users className="w-5 h-5 text-violet-600" />
            ) : (
              <GraduationCap className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {user.full_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (user: PendingUser) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          user.type === 'student'
            ? 'bg-violet-100 text-violet-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {user.type === 'student' ? 'Student' : 'Teacher'}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user: PendingUser) => <StatusBadge status={user.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: PendingUser) => (
        <div className="flex items-center gap-2">
          <ActionButtons
            variant="approval"
            onView={() => setViewUser(user)}
            onApprove={() => handleApprove(user.id)}
            onReject={() => handleReject(user.id)}
          />
        </div>
      ),
    },
  ];

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const response = await fetch(`/api/admin/registrations/${id}/approve`, { method: 'POST' });
      if (response.ok) {
        toast.success("Application approved successfully");
        setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        toast.error("Failed to approve application");
      }
    } catch (error) {
      toast.error("Failed to approve application");
    }
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      const response = await fetch(`/api/admin/registrations/${id}/reject`, { method: 'POST' });
      if (response.ok) {
        toast.success("Application rejected");
        setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        toast.error("Failed to reject application");
      }
    } catch (error) {
      toast.error("Failed to reject application");
    }
    setProcessing(null);
  };

  return (
    <>
      <PageHeader
        title="Pending Approvals"
        description="Review and approve new student and teacher applications"
        breadcrumbs={[]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AdminCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Students</p>
              <p className="text-2xl font-bold">{pendingUsers.filter(u => u.type === 'student').length}</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Teachers</p>
              <p className="text-2xl font-bold">{pendingUsers.filter(u => u.type === 'teacher').length}</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pending</p>
              <p className="text-2xl font-bold">{pendingUsers.length}</p>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard>
        <div className="mb-6">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            {typeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingSkeleton rows={5} columns={4} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="No pending approvals"
            description="All applications have been reviewed"
          />
        ) : (
          <AdminTable
            data={filteredUsers}
            columns={columns}
            keyExtractor={(u) => u.id}
          />
        )}
      </AdminCard>

      {/* View Modal */}
      <AdminModal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title="Application Details"
        size="md"
        footer={
          viewUser && (
            <div className="flex gap-3">
              <button
                onClick={() => handleReject(viewUser.id)}
                disabled={processing === viewUser.id}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                {processing === viewUser.id ? "Processing..." : "Reject"}
              </button>
              <button
                onClick={() => handleApprove(viewUser.id)}
                disabled={processing === viewUser.id}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {processing === viewUser.id ? "Processing..." : "Approve"}
              </button>
            </div>
          )
        }
      >
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                viewUser.type === 'student' ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-green-100 dark:bg-green-900/30'
              }`}>
                {viewUser.type === 'student' ? (
                  <Users className="w-8 h-8 text-violet-600" />
                ) : (
                  <GraduationCap className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{viewUser.full_name}</h3>
                <p className="text-sm text-gray-500">{viewUser.type === 'student' ? 'Student Application' : 'Teacher Application'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{viewUser.email}</span>
                </div>
              </div>
              {viewUser.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{viewUser.phone}</span>
                  </div>
                </div>
              )}
              {viewUser.country && (
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{viewUser.country}</span>
                  </div>
                </div>
              )}
              {viewUser.age && (
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{viewUser.age} years</span>
                  </div>
                </div>
              )}
            </div>

            {viewUser.academic_details && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Academic Details</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{viewUser.academic_details}</p>
              </div>
            )}
            {viewUser.qualifications && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Qualifications</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{viewUser.qualifications}</p>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </>
  );
}
}