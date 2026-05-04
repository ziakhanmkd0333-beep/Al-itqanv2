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
  ConfirmDialog,
} from "@/components/admin";
import {
  useTeachers,
  useTeacherMutations,
  type Teacher,
} from "@/hooks";
import {
  GraduationCap,
  Plus,
  Mail,
  Phone,
} from "lucide-react";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

export default function TeachersPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <TeachersContent />
      </AdminLayout>
    </AdminRoute>
  );
}

function TeachersContent() {
  const {
    data: teachers,
    total,
    page,
    limit,
    search,
    loading,
    totalPages,
    setPage,
    setSearch,
    refetch,
  } = useTeachers(1, 10);

  const { updateTeacher, deleteTeacher, isDeleting, isUpdating } = useTeacherMutations();
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const filteredTeachers = statusFilter
    ? teachers.filter((t) => t.status === statusFilter)
    : teachers;

  const columns = [
    {
      key: "name",
      header: "Teacher",
      render: (teacher: Teacher) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {teacher.full_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {teacher.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      header: "Specialization",
      render: (teacher: Teacher) => (
        <div className="flex flex-wrap gap-1">
          {teacher.specialization?.slice(0, 2).map((spec, i) => (
            <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
              {spec}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (teacher: Teacher) => <StatusBadge status={teacher.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (teacher: Teacher) => (
        <ActionButtons
          onView={() => setViewTeacher(teacher)}
          onEdit={() => setEditTeacher(teacher)}
          onDelete={() => setDeleteId(teacher.id)}
        />
      ),
    },
  ];

  const handleUpdateTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTeacher) return;

    const formData = new FormData(e.currentTarget);
    await updateTeacher(editTeacher.id, {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      specialization: (formData.get("specialization") as string).split(",").map((s) => s.trim()),
      qualifications: formData.get("qualifications") as string,
      status: formData.get("status") as Teacher["status"],
    });
    setEditTeacher(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteTeacher(deleteId);
    setDeleteId(null);
    refetch();
  };

  return (
    <>
      <PageHeader
        title="Teachers"
        description="Manage teaching staff"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        }
      />

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search teachers..."
            className="sm:w-80"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Filter by status"
            className="sm:w-48"
          />
        </div>

        {loading ? (
          <LoadingSkeleton rows={5} columns={4} />
        ) : filteredTeachers.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No teachers found"
            description={
              search || statusFilter
                ? "Try adjusting your search or filters"
                : "No teachers have been registered yet"
            }
          />
        ) : (
          <AdminTable
            data={filteredTeachers}
            columns={columns}
            keyExtractor={(t) => t.id}
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
        isOpen={!!viewTeacher}
        onClose={() => setViewTeacher(null)}
        title="Teacher Details"
        size="md"
      >
        {viewTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{viewTeacher.full_name}</h3>
                <StatusBadge status={viewTeacher.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  <span>{viewTeacher.email}</span>
                </div>
              </div>
              {viewTeacher.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>{viewTeacher.phone}</span>
                  </div>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Specialization</p>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {viewTeacher.specialization?.map((spec, i) => (
                    <span key={i} className="px-2 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editTeacher}
        onClose={() => setEditTeacher(null)}
        title="Edit Teacher"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditTeacher(null)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-teacher-form"
              disabled={isUpdating}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      >
        {editTeacher && (
          <form id="edit-teacher-form" onSubmit={handleUpdateTeacher} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                name="full_name"
                defaultValue={editTeacher.full_name}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={editTeacher.email}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                name="phone"
                defaultValue={editTeacher.phone || ""}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Specialization (comma separated)
              </label>
              <input
                name="specialization"
                defaultValue={editTeacher.specialization?.join(", ") || ""}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Qualifications
              </label>
              <textarea
                name="qualifications"
                defaultValue={editTeacher.qualifications || ""}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={editTeacher.status}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
              >
                {statusOptions.slice(1).map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}