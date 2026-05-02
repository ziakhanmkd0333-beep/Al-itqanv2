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
  useStudents,
  useStudentMutations,
  type Student,
} from "@/hooks";
import {
  Users,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserPlus,
} from "lucide-react";

const countries = [
  "Pakistan", "Saudi Arabia", "UAE", "USA", "UK", "Canada", "Australia",
  "India", "Bangladesh", "Egypt", "Turkey", "Malaysia", "Indonesia", "Other"
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

export default function StudentsPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <StudentsContent />
      </AdminLayout>
    </AdminRoute>
  );
}

function StudentsContent() {
  const {
    data: students,
    total,
    page,
    limit,
    search,
    loading,
    totalPages,
    setPage,
    setSearch,
    refetch,
  } = useStudents(1, 10);

  const { updateStudent, deleteStudent, isDeleting, isUpdating } = useStudentMutations();
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const filteredStudents = statusFilter
    ? students.filter((s) => s.status === statusFilter)
    : students;

  const columns = [
    {
      key: "name",
      header: "Student",
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {student.full_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {student.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (student: Student) => (
        <div className="space-y-1">
          {student.phone && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              {student.phone}
            </div>
          )}
          {student.country && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {student.country}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "age",
      header: "Age",
      render: (student: Student) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {student.age} years
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (student: Student) => <StatusBadge status={student.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (student: Student) => (
        <ActionButtons
          onView={() => setViewStudent(student)}
          onEdit={() => setEditStudent(student)}
          onDelete={() => setDeleteId(student.id)}
        />
      ),
    },
  ];

  const handleUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editStudent) return;

    const formData = new FormData(e.currentTarget);
    await updateStudent(editStudent.id, {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      country: formData.get("country") as string,
      age: parseInt(formData.get("age") as string) || 0,
      status: formData.get("status") as Student["status"],
    });
    setEditStudent(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteStudent(deleteId);
    setDeleteId(null);
    refetch();
  };

  return (
    <>
      <PageHeader
        title="Students"
        description="Manage enrolled students"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        }
      />

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search students..."
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
          <LoadingSkeleton rows={5} columns={5} />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No students found"
            description={
              search || statusFilter
                ? "Try adjusting your search or filters"
                : "No students have been registered yet"
            }
          />
        ) : (
          <AdminTable
            data={filteredStudents}
            columns={columns}
            keyExtractor={(s) => s.id}
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
        isOpen={!!viewStudent}
        onClose={() => setViewStudent(null)}
        title="Student Details"
        size="md"
      >
        {viewStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{viewStudent.full_name}</h3>
                <StatusBadge status={viewStudent.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-500" />
                  <span>{viewStudent.email}</span>
                </div>
              </div>
              {viewStudent.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-violet-500" />
                    <span>{viewStudent.phone}</span>
                  </div>
                </div>
              )}
              {viewStudent.country && (
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    <span>{viewStudent.country}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <span>{viewStudent.age} years</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        title="Edit Student"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditStudent(null)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-student-form"
              disabled={isUpdating}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50">
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      >
        {editStudent && (
          <form id="edit-student-form" onSubmit={handleUpdateStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                name="full_name"
                defaultValue={editStudent.full_name}
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
                defaultValue={editStudent.email}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  defaultValue={editStudent.phone || ""}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  defaultValue={editStudent.country || ""}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  name="age"
                  type="number"
                  defaultValue={editStudent.age}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editStudent.status}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                >
                  {statusOptions.slice(1).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}