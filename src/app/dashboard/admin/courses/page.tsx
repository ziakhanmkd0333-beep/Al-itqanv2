"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  FileText,
  GraduationCap,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

// Types
interface Course {
  id: string;
  title: string;
  title_ar?: string;
  title_ur?: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Specialized";
  category: "Quran" | "Arabic Language" | "Fiqh" | "Sarf & Nahw" | "Hadith";
  description: string;
  description_ar?: string;
  description_ur?: string;
  fee_min: number;
  fee_max: number;
  duration: string;
  schedule: string;
  prerequisites: string[] | string;
  core_books: string[] | string;
  next_course: string;
  status: "published" | "draft" | "archived";
  teacher_id: string;
  teacher_name?: string;
  image_url?: string;
  students_count: number;
  created_at: string;
}

interface CourseFormData {
  title: string;
  title_ar: string;
  title_ur: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Specialized";
  category: "Quran" | "Arabic Language" | "Fiqh" | "Sarf & Nahw" | "Hadith";
  description: string;
  description_ar: string;
  description_ur: string;
  fee_min: number;
  fee_max: number;
  duration: string;
  schedule: string;
  prerequisites: string[];
  core_books: string[];
  next_course: string;
  status: "published" | "draft" | "archived";
  teacher_id: string;
}

const initialFormData: CourseFormData = {
  title: "",
  title_ar: "",
  title_ur: "",
  level: "Beginner",
  category: "Quran",
  description: "",
  description_ar: "",
  description_ur: "",
  fee_min: 20,
  fee_max: 30,
  duration: "",
  schedule: "",
  prerequisites: [],
  core_books: [],
  next_course: "",
  status: "draft",
  teacher_id: ""
};

const categories = ["Quran", "Arabic Language", "Fiqh", "Sarf & Nahw", "Hadith"];
const levels = ["Beginner", "Intermediate", "Advanced", "Specialized"];
const statuses = [
  { value: "published", label: "Published", color: "green" },
  { value: "draft", label: "Draft", color: "yellow" },
  { value: "archived", label: "Archived", color: "gray" }
];

// Progression paths per category
const progressionPaths: Record<string, string[]> = {
  "Quran": ["Noorani Qaida", "Nazra Quran", "Quran with Tajweed", "Advanced Tajweed Program", "Hifz-ul-Quran", "Tarjamat-ul-Quran", "Advanced Tafseer-ul-Quran"],
  "Arabic Language": ["Beginner Arabic", "Intermediate Arabic", "Advanced Spoken Arabic", "Advanced Ilm-e-Balaghat"],
  "Fiqh": ["Basic Fiqh (Qudoori)", "Intermediate Fiqh (Kanz)", "Advanced Fiqh (Hidaya)", "Basic Usool Fiqh (Shashi)", "Intermediate Usool Fiqh", "Advanced Usool Fiqh"],
  "Sarf & Nahw": ["Basic Sarf & Nahw", "Intermediate Sarf & Nahw", "Advanced Sarf & Nahw"],
  "Hadith": ["Basic Hadith", "Intermediate Hadith", "Advanced Hadith", "Takhassus fil Hadith"]
};

export default function CoursesManagementPage() {
  const { t, isRTL } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newCoreBook, setNewCoreBook] = useState("");

  const itemsPerPage = 12;

  // Fetch courses from backend
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      console.log('[Courses] Fetching courses via API...');
      const response = await fetch('/api/admin/courses?limit=100', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('[Courses] Fetched', result.courses?.length || 0, 'courses');
      setCourses(result.courses || []);
    } catch (error: any) {
      console.error("[Courses] Error fetching courses:", error);
      setError(error?.message || 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const openAddModal = () => {
    setFormData(initialFormData);
    setModalMode("add");
    setShowModal(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    // Ensure prerequisites and core_books are arrays
    const prereqs = Array.isArray(course.prerequisites) 
      ? course.prerequisites 
      : typeof course.prerequisites === 'string' 
        ? course.prerequisites.split(',').map(p => p.trim()).filter(p => p)
        : [];
    const books = Array.isArray(course.core_books) 
      ? course.core_books 
      : typeof course.core_books === 'string' 
        ? course.core_books.split(',').map(b => b.trim()).filter(b => b)
        : [];
    setFormData({
      title: course.title,
      title_ar: course.title_ar || "",
      title_ur: course.title_ur || "",
      level: course.level,
      category: course.category,
      description: course.description,
      description_ar: course.description_ar || "",
      description_ur: course.description_ur || "",
      fee_min: course.fee_min,
      fee_max: course.fee_max,
      duration: course.duration,
      schedule: course.schedule,
      prerequisites: prereqs,
      core_books: books,
      next_course: course.next_course,
      status: course.status,
      teacher_id: course.teacher_id
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const openViewModal = (course: Course) => {
    setSelectedCourse(course);
    setModalMode("view");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setFormData(initialFormData);
    setNewPrerequisite("");
    setNewCoreBook("");
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fee_min" || name === "fee_max" ? parseInt(value) || 0 : value
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite && !formData.prerequisites.includes(newPrerequisite)) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite]
      }));
    }
    setNewPrerequisite("");
  };

  const removePrerequisite = (prereq: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p) => p !== prereq)
    }));
  };

  const addCoreBook = () => {
    if (newCoreBook && !formData.core_books.includes(newCoreBook)) {
      setFormData((prev) => ({
        ...prev,
        core_books: [...prev.core_books, newCoreBook]
      }));
    }
    setNewCoreBook("");
  };

  const removeCoreBook = (book: string) => {
    setFormData((prev) => ({
      ...prev,
      core_books: prev.core_books.filter((b) => b !== book)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert arrays to comma-separated strings for database
      const prereqsString = Array.isArray(formData.prerequisites) 
        ? formData.prerequisites.join(', ') 
        : formData.prerequisites;
      const booksString = Array.isArray(formData.core_books) 
        ? formData.core_books.join(', ') 
        : formData.core_books;
      
      // Generate slug from title
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const courseData = {
        title: formData.title,
        slug: slug,
        level: formData.level,
        category: formData.category,
        description: formData.description,
        duration: formData.duration,
        schedule: formData.schedule,
        fee_min: formData.fee_min,
        fee_max: formData.fee_max,
        prerequisites: prereqsString,
        core_books: booksString,
        next_course: formData.next_course,
        status: formData.status,
        teacher_id: formData.teacher_id || null,
        display_order: 0
      };

      if (modalMode === "add") {
        // Create new course via API
        const res = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        // Add to local state
        setCourses((prev) => [data.course, ...prev]);
      } else if (modalMode === "edit" && selectedCourse) {
        // Update course via API
        const res = await fetch('/api/admin/courses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedCourse.id, ...courseData })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        // Update local state
        setCourses((prev) =>
          prev.map((c) => c.id === selectedCourse.id ? data.course : c)
        );
      }
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving course:", error);
      alert("Failed to save course: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!courseToDelete) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses?id=${courseToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete));
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
    } catch (error: unknown) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      published: "bg-green-100 text-green-700 border-green-200",
      draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
      archived: "bg-gray-100 text-gray-700 border-gray-200"
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.draft}`}
      >
        <CheckCircle className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Level badge component
  const LevelBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      Beginner: "bg-blue-100 text-blue-700",
      Intermediate: "bg-purple-100 text-purple-700",
      Advanced: "bg-orange-100 text-orange-700",
      Specialized: "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[level] || colors.Beginner}`}>
        {level}
      </span>
    );
  };

  // Category badge component
  const CategoryBadge = ({ category }: { category: string }) => {
    const colors: Record<string, string> = {
      Quran: "bg-emerald-100 text-emerald-700",
      "Arabic Language": "bg-cyan-100 text-cyan-700",
      Fiqh: "bg-amber-100 text-amber-700",
      "Sarf & Nahw": "bg-pink-100 text-pink-700",
      Hadith: "bg-violet-100 text-violet-700"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[category] || colors.Quran}`}>
        {category}
      </span>
    );
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
                {t("admin.courses.title") || "Courses Management"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.courses.subtitle") || "Manage all 24 courses across 5 disciplines"}
              </p>
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors">
                <Download className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.export") || "Export"}</span>
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.addCourse") || "Add Course"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Error loading courses</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={fetchCourses}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: t("admin.courses.total") || "Total Courses", value: courses.length, icon: BookOpen, color: "#8B5CF6" },
            { label: "Quran", value: courses.filter((c) => c.category === "Quran").length, icon: BookOpen, color: "#10B981" },
            { label: "Arabic", value: courses.filter((c) => c.category === "Arabic Language").length, icon: BookOpen, color: "#06B6D4" },
            { label: "Fiqh", value: courses.filter((c) => c.category === "Fiqh").length, icon: BookOpen, color: "#F59E0B" },
            { label: "Hadith", value: courses.filter((c) => c.category === "Hadith").length, icon: BookOpen, color: "#8B5CF6" }
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

        {/* Progression Paths Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card p-6 rounded-xl border border-[var(--border)] mb-8"
        >
          <h2 className={`text-lg font-bold text-[var(--text-primary)] mb-4 ${isRTL ? "arabic-text" : ""}`}>
            {t("admin.courses.progressionPaths") || "Course Progression Paths"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(progressionPaths).map(([category, path]) => (
              <div key={category} className="p-4 bg-[var(--background-green)] rounded-xl">
                <CategoryBadge category={category} />
                <div className={`flex flex-wrap items-center gap-1 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {path.map((course, index) => (
                    <div key={course} className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className={`text-xs text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                        {course.split(" ")[0]}
                      </span>
                      {index < path.length - 1 && (
                        isRTL ? <ArrowLeft className="w-3 h-3 text-[var(--text-muted)] mx-1" /> : <ArrowRight className="w-3 h-3 text-[var(--text-muted)] mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card p-4 rounded-xl border border-[var(--border)] mb-6"
        >
          <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div className="flex-1 relative">
              <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
              <input
                type="text"
                placeholder={t("admin.courses.searchPlaceholder") || "Search courses..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? "pr-10 pl-4 arabic-text" : "pl-10 pr-4"} py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]`}
              />
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.courses.allCategories") || "All Categories"}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.courses.allLevels") || "All Levels"}</option>
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.courses.allStatus") || "All Status"}</option>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.loading") || "Loading..."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Course Header */}
                <div className="relative p-4 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--background-green)]">
                  <div className={`flex items-start justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <CategoryBadge category={course.category} />
                    <StatusBadge status={course.status} />
                  </div>
                  <h3 className={`font-bold text-[var(--text-primary)] text-lg mb-1 line-clamp-2 ${isRTL ? "arabic-text" : ""}`}>
                    {course.title}
                  </h3>
                  <LevelBadge level={course.level} />
                </div>

                {/* Course Info */}
                <div className="p-4 space-y-3">
                  <p className={`text-sm text-[var(--text-muted)] line-clamp-2 ${isRTL ? "arabic-text" : ""}`}>
                    {course.description}
                  </p>

                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Clock className="w-4 h-4 text-[var(--primary)]" />
                      <span className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>{course.duration}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <DollarSign className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-[var(--text-secondary)]">${course.fee_min}–${course.fee_max}/mo</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Users className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-[var(--text-secondary)]">{course.students_count} students</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                      <GraduationCap className="w-4 h-4 text-[var(--primary)]" />
                      <span className={`text-[var(--text-secondary)] truncate ${isRTL ? "arabic-text" : ""}`}>{course.teacher_name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-2 pt-3 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => openViewModal(course)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.view") || "View"}</span>
                    </button>
                    <button
                      onClick={() => openEditModal(course)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors text-xs"
                    >
                      <Edit className="w-3 h-3" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.edit") || "Edit"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCourseToDelete(course.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center justify-between mt-6 p-4 bg-card rounded-xl border border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.showing") || "Showing"} {(currentPage - 1) * itemsPerPage + 1} {t("admin.to") || "to"}{" "}
              {Math.min(currentPage * itemsPerPage, filteredCourses.length)} {t("admin.of") || "of"} {filteredCourses.length}{" "}
              {t("admin.courses.results") || "courses"}
            </p>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                return (
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
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className={`text-xl font-semibold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.courses.noResults") || "No courses found"}
            </h3>
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.courses.tryDifferent") || "Try adjusting your search or filter criteria"}
            </p>
          </motion.div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--background)] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto my-8 shadow-2xl border border-[var(--border)]"
            >
              {/* Modal Header */}
              <div className={`sticky top-0 bg-card flex items-center justify-between p-6 border-b border-[var(--border)] z-10 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                  {modalMode === "add"
                    ? t("admin.courses.addCourse") || "Add New Course"
                    : modalMode === "edit"
                    ? t("admin.courses.editCourse") || "Edit Course"
                    : t("admin.courses.viewCourse") || "Course Details"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Modal Content */}
              {modalMode === "view" && selectedCourse ? (
                <div className="p-6 space-y-6">
                  {/* Course Header */}
                  <div className="p-6 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--background-green)] rounded-xl">
                    <div className={`flex items-start justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <CategoryBadge category={selectedCourse.category} />
                      <StatusBadge status={selectedCourse.status} />
                    </div>
                    <h3 className={`text-2xl font-bold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {selectedCourse.title}
                    </h3>
                    {selectedCourse.title_ar && (
                      <p className={`text-lg text-[var(--text-secondary)] mb-1 ${isRTL ? "arabic-text" : ""}`}>
                        {selectedCourse.title_ar}
                      </p>
                    )}
                    {selectedCourse.title_ur && (
                      <p className={`text-lg text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedCourse.title_ur}
                      </p>
                    )}
                    <div className={`flex items-center gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <LevelBadge level={selectedCourse.level} />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.courses.description") || "Description"}
                    </h4>
                    <p className={`text-[var(--text-secondary)] leading-relaxed ${isRTL ? "arabic-text" : ""}`}>
                      {selectedCourse.description}
                    </p>
                  </div>

                  {/* Course Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <Clock className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.duration") || "Duration"}</p>
                      <p className={`font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedCourse.duration}</p>
                    </div>
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <DollarSign className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.fee") || "Fee/Month"}</p>
                      <p className="font-semibold text-[var(--text-primary)]">${selectedCourse.fee_min}–${selectedCourse.fee_max}</p>
                    </div>
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <Users className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.students") || "Students"}</p>
                      <p className="font-semibold text-[var(--text-primary)]">{selectedCourse.students_count}</p>
                    </div>
                    <div className="p-4 bg-[var(--background-green)] rounded-xl text-center">
                      <Calendar className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.schedule") || "Schedule"}</p>
                      <p className={`text-xs font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedCourse.schedule}</p>
                    </div>
                  </div>

                  {/* Teacher */}
                  <div className={`flex items-center gap-4 p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                      {selectedCourse.teacher_name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.instructor") || "Instructor"}</p>
                      <p className={`font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedCourse.teacher_name}</p>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                    <div>
                      <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.prerequisites") || "Prerequisites"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(selectedCourse.prerequisites) 
                          ? selectedCourse.prerequisites 
                          : [selectedCourse.prerequisites]
                        ).map((prereq, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg text-sm ${isRTL ? "arabic-text" : ""}`}
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Core Books */}
                  {selectedCourse.core_books && (
                    <div>
                      <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.coreBooks") || "Core Books"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(selectedCourse.core_books) 
                          ? selectedCourse.core_books 
                          : [selectedCourse.core_books]
                        ).map((book, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-2 px-3 py-2 bg-[var(--background-green)] text-[var(--text-primary)] rounded-lg text-sm border border-[var(--border)] ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                          >
                            <FileText className="w-4 h-4 text-[var(--primary)]" />
                            {book}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Course */}
                  {selectedCourse.next_course && (
                    <div className={`flex items-center gap-3 p-4 border border-[var(--border)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                      <ArrowRight className={`w-5 h-5 text-[var(--primary)] ${isRTL ? "rotate-180" : ""}`} />
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.courses.nextCourse") || "Next Course"}</p>
                        <p className={`font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>{selectedCourse.next_course}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => {
                        closeModal();
                        openEditModal(selectedCourse);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.editCourse") || "Edit Course"}</span>
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                    >
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.close") || "Close"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.title") || "Title (English)"} *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.titleAr") || "Title (Arabic)"}
                      </label>
                      <input
                        type="text"
                        name="title_ar"
                        value={formData.title_ar}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] arabic-text`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.titleUr") || "Title (Urdu)"}
                      </label>
                      <input
                        type="text"
                        name="title_ur"
                        value={formData.title_ur}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] arabic-text`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.category") || "Category"} *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.level") || "Level"} *
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        {levels.map((lvl) => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.status") || "Status"} *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.duration") || "Duration"} *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 3 Months"
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.schedule") || "Schedule"} *
                      </label>
                      <input
                        type="text"
                        name="schedule"
                        value={formData.schedule}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 3–5 days/week · 45 min"
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.feeMin") || "Min Fee ($)"} *
                      </label>
                      <input
                        type="number"
                        name="fee_min"
                        value={formData.fee_min}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.feeMax") || "Max Fee ($)"} *
                      </label>
                      <input
                        type="number"
                        name="fee_max"
                        value={formData.fee_max}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.description") || "Description (English)"} *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.descriptionAr") || "Description (Arabic)"}
                      </label>
                      <textarea
                        name="description_ar"
                        value={formData.description_ar}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none arabic-text`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                        {t("admin.courses.form.descriptionUr") || "Description (Urdu)"}
                      </label>
                      <textarea
                        name="description_ur"
                        value={formData.description_ur}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] resize-none arabic-text`}
                      />
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.courses.form.prerequisites") || "Prerequisites"}
                    </label>
                    <div className={`flex gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <select
                        value={newPrerequisite}
                        onChange={(e) => setNewPrerequisite(e.target.value)}
                        className={`flex-1 px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      >
                        <option value="">{t("admin.courses.form.selectPrerequisite") || "Select Prerequisite"}</option>
                        {courses
                          .filter((c) => !(formData.prerequisites || []).includes(c.title))
                          .map((c) => (
                            <option key={c.id} value={c.title}>{c.title}</option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={addPrerequisite}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.prerequisites || []).map((prereq) => (
                        <span
                          key={prereq}
                          className={`inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                        >
                          {prereq}
                          <button type="button" onClick={() => removePrerequisite(prereq)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Core Books */}
                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.courses.form.coreBooks") || "Core Books"}
                    </label>
                    <div className={`flex gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <input
                        type="text"
                        value={newCoreBook}
                        onChange={(e) => setNewCoreBook(e.target.value)}
                        placeholder={t("admin.courses.form.enterBook") || "Enter book name..."}
                        className={`flex-1 px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={addCoreBook}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.core_books || []).map((book) => (
                        <span
                          key={book}
                          className={`inline-flex items-center gap-2 px-3 py-1 bg-[var(--background-green)] text-[var(--text-primary)] rounded-full text-sm border border-[var(--border)] ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                        >
                          <FileText className="w-3 h-3 text-[var(--primary)]" />
                          {book}
                          <button type="button" onClick={() => removeCoreBook(book)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Next Course */}
                  <div>
                    <label className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                      {t("admin.courses.form.nextCourse") || "Next Course in Progression"}
                    </label>
                    <select
                      name="next_course"
                      value={formData.next_course}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
                    >
                      <option value="">{t("admin.courses.form.none") || "None (End of Path)"}</option>
                      {courses
                        .filter((c) => c.category === formData.category && c.title !== formData.title)
                        .map((c) => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                    </select>
                  </div>

                  {/* Form Actions */}
                  <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                    >
                      {modalMode === "add" ? (
                        <>
                          <Plus className="w-4 h-4" />
                          <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.addCourse") || "Add Course"}</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.updateCourse") || "Update Course"}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                    >
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.cancel") || "Cancel"}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className={`text-xl font-bold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {t("admin.courses.deleteConfirm.title") || "Delete Course?"}
                </h3>
                <p className={`text-[var(--text-muted)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                  {t("admin.courses.deleteConfirm.message") || "This action cannot be undone. The course will be permanently removed from the system."}
                </p>
                <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className={isRTL ? "arabic-text" : ""}>{t("admin.courses.deleteConfirm.confirm") || "Delete"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setCourseToDelete(null);
                    }}
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
