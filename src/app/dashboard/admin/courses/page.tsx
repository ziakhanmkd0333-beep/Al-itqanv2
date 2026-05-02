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
  useCourses,
  useCourseMutations,
  type Course,
} from "@/hooks";
import {
  BookOpen,
  Plus,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "Quran", label: "Quran" },
  { value: "Arabic Language", label: "Arabic Language" },
  { value: "Fiqh", label: "Fiqh" },
  { value: "Sarf & Nahw", label: "Sarf & Nahw" },
  { value: "Hadith", label: "Hadith" },
];

const categoryColors: Record<string, string> = {
  Quran: "#10B981",
  "Arabic Language": "#06B6D4",
  Fiqh: "#F59E0B",
  Hadith: "#8B5CF6",
  "Sarf & Nahw": "#EC4899",
};

export default function CoursesPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <CoursesContent />
      </AdminLayout>
    </AdminRoute>
  );
}

function CoursesContent() {
  const {
    data: courses,
    total,
    page,
    limit,
    search,
    loading,
    totalPages,
    setPage,
    setSearch,
    refetch,
  } = useCourses(1, 10);

  const { updateCourse, deleteCourse, isDeleting, isUpdating } = useCourseMutations();
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredCourses = courses.filter((c) => {
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    const matchesCategory = categoryFilter ? c.category === categoryFilter : true;
    return matchesStatus && matchesCategory;
  });

  const columns = [
    {
      key: "name",
      header: "Course",
      render: (course: Course) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {course.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {course.category} | {course.level}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "fees",
      header: "Fees",
      render: (course: Course) => (
        <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
          <DollarSign className="w-4 h-4 text-amber-500" />
          ${course.fee_min} - ${course.fee_max}
        </div>
      ),
    },
    {
      key: "students",
      header: "Students",
      render: (course: Course) => (
        <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
          <Users className="w-4 h-4 text-amber-500" />
          {course.students_count || 0}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (course: Course) => <StatusBadge status={course.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (course: Course) => (
        <ActionButtons
          onView={() => setViewCourse(course)}
          onEdit={() => setEditCourse(course)}
          onDelete={() => setDeleteId(course.id)}
        />
      ),
    },
  ];

  const handleUpdateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editCourse) return;

    const formData = new FormData(e.currentTarget);
    await updateCourse(editCourse.id, {
      title: formData.get("title") as string,
      title_ar: formData.get("title_ar") as string,
      title_ur: formData.get("title_ur") as string,
      level: formData.get("level") as Course["level"],
      category: formData.get("category") as Course["category"],
      description: formData.get("description") as string,
      fee_min: parseInt(formData.get("fee_min") as string) || 0,
      fee_max: parseInt(formData.get("fee_max") as string) || 0,
      duration: formData.get("duration") as string,
      status: formData.get("status") as Course["status"],
    });
    setEditCourse(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteCourse(deleteId);
    setDeleteId(null);
    refetch();
  };

  return (
    <>
      <PageHeader
        title="Courses"
        description="Manage course offerings"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        }
      />

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search courses..."
            className="sm:w-80"
          />
          <FilterSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="Filter by category"
            className="sm:w-48"
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
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description={
              search || statusFilter || categoryFilter
                ? "Try adjusting your search or filters"
                : "No courses have been created yet"
            }
          />
        ) : (
          <AdminTable
            data={filteredCourses}
            columns={columns}
            keyExtractor={(c) => c.id}
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
        isOpen={!!viewCourse}
        onClose={() => setViewCourse(null)}
        title="Course Details"
        size="md"
      >
        {viewCourse && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{viewCourse.title}</h3>
                <StatusBadge status={viewCourse.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <span className="text-sm font-medium" style={{ color: categoryColors[viewCourse.category] }}>
                  {viewCourse.category}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Level</p>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {viewCourse.level}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fee Range</p>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  <span>${viewCourse.fee_min} - ${viewCourse.fee_max}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{viewCourse.duration}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>{viewCourse.students_count || 0} enrolled</span>
                </div>
              </div>
            </div>

            {viewCourse.description && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{viewCourse.description}</p>
              </div>
            )}
          </div>
        )}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editCourse}
        onClose={() => setEditCourse(null)}
        title="Edit Course"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditCourse(null)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-course-form"
              disabled={isUpdating}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      >
        {editCourse && (
          <form id="edit-course-form" onSubmit={handleUpdateCourse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                name="title"
                defaultValue={editCourse.title}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title (Arabic)
                </label>
                <input
                  name="title_ar"
                  defaultValue={editCourse.title_ar || ""}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title (Urdu)
                </label>
                <input
                  name="title_ur"
                  defaultValue={editCourse.title_ur || ""}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={editCourse.category}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                >
                  {categoryOptions.slice(1).map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level
                </label>
                <select
                  name="level"
                  defaultValue={editCourse.level}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                >
                  {["Beginner", "Intermediate", "Advanced", "Specialized"].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={editCourse.description || ""}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Fee ($)
                </label>
                <input
                  name="fee_min"
                  type="number"
                  defaultValue={editCourse.fee_min}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Fee ($)
                </label>
                <input
                  name="fee_max"
                  type="number"
                  defaultValue={editCourse.fee_max}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration
              </label>
              <input
                name="duration"
                defaultValue={editCourse.duration}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={editCourse.status}
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
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}