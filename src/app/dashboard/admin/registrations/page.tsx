"use client";

import { useState } from "react";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AdminCard,
  AdminTable,
  SearchInput,
  FilterSelect,
  Pagination,
  StatusBadge,
  ActionButtons,
  PageHeader,
  EmptyState,
  LoadingSkeleton,
  AdminModal,
} from "@/components/admin";
import { useAdminRegistrations } from "@/hooks";
import {
  Users,
  GraduationCap,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
} from "lucide-react";

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
  status: string;
  created_at: string;
}

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "student", label: "Students" },
  { value: "teacher", label: "Teachers" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function RegistrationsPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <RegistrationsContent />
      </AdminLayout>
    </AdminRoute>
  );
}

function RegistrationsContent() {
  const {
    data: registrations,
    total,
    page,
    limit,
    search,
    loading,
    totalPages,
    setPage,
    setSearch,
    refetch,
  } = useAdminRegistrations(1, 10);

  const [viewReg, setViewReg] = useState<Registration | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredRegs = registrations.filter((r) => {
    const matchesType = typeFilter ? r.user_type === typeFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesType && matchesStatus;
  });

  const columns = [
    {
      key: "name",
      header: "Applicant",
      render: (r: Registration) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            r.user_type === 'student' ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-green-100 dark:bg-green-900/30'
          }`}>
            {r.user_type === 'student' ? (
              <Users className="w-5 h-5 text-violet-600" />
            ) : (
              <GraduationCap className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{r.full_name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (r: Registration) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          r.user_type === 'student'
            ? 'bg-violet-100 text-violet-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {r.user_type === 'student' ? 'Student' : 'Teacher'}
        </span>
      ),
    },
    {
      key: "country",
      header: "Country",
      render: (r: Registration) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          {r.country}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r: Registration) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (r: Registration) => (
        <div className="flex items-center gap-2">
          <ActionButtons
            variant={r.status === 'pending' ? 'approval' : 'default'}
            onView={() => setViewReg(r)}
            onApprove={r.status === 'pending' ? () => handleApprove(r.id) : undefined}
            onReject={r.status === 'pending' ? () => handleReject(r.id) : undefined}
          />
        </div>
      ),
    },
  ];

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        refetch();
      }
    } catch (e) {}
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        refetch();
      }
    } catch (e) {}
    setProcessing(null);
  };

  return (
    <>
      <PageHeader
        title="Registrations"
        description="Manage student and teacher registrations"
      />

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search registrations..."
            className="sm:w-80"
          />
          <FilterSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
            placeholder="Filter by type"
            className="sm:w-40"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Filter by status"
            className="sm:w-40"
          />
        </div>

        {loading ? (
          <LoadingSkeleton rows={5} columns={5} />
        ) : filteredRegs.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No registrations found"
            description={search || typeFilter || statusFilter ? "Try adjusting filters" : "No registrations yet"}
          />
        ) : (
          <AdminTable
            data={filteredRegs}
            columns={columns}
            keyExtractor={(r) => r.id}
          />
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          className="mt-6"
        />
      </AdminCard>

      {/* View Modal */}
      <AdminModal
        isOpen={!!viewReg}
        onClose={() => setViewReg(null)}
        title="Registration Details"
        size="md"
      >
        {viewReg && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                viewReg.user_type === 'student' ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-green-100 dark:bg-green-900/30'
              }`}>
                {viewReg.user_type === 'student' ? (
                  <Users className="w-8 h-8 text-violet-600" />
                ) : (
                  <GraduationCap className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{viewReg.full_name}</h3>
                <p className="text-sm text-gray-500">{viewReg.user_type === 'student' ? 'Student' : 'Teacher'}</p>
                <StatusBadge status={viewReg.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{viewReg.email}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{viewReg.phone}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{viewReg.country}</span>
                </div>
              </div>
              {viewReg.age && (
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{viewReg.age} years</span>
                  </div>
                </div>
              )}
              {viewReg.experience_years && (
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>{viewReg.experience_years} years</span>
                  </div>
                </div>
              )}
            </div>

            {viewReg.qualifications && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Qualifications</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{viewReg.qualifications}</p>
              </div>
            )}

            {viewReg.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleReject(viewReg.id)}
                  disabled={processing === viewReg.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {processing === viewReg.id ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={() => handleApprove(viewReg.id)}
                  disabled={processing === viewReg.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {processing === viewReg.id ? 'Processing...' : 'Approve'}
                </button>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </>
  );