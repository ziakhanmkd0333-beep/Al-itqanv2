"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import {
  Video,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Play,
  X,
  Search
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface Course {
  id: string;
  title: string;
}

interface Teacher {
  id: string;
  full_name: string;
}

interface LiveSession {
  id: string;
  title: string;
  description: string;
  course_id: string;
  course_title: string;
  teacher_id: string;
  teacher_name: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  meeting_url: string;
  meeting_platform: string;
  status: string;
  is_recorded: boolean;
  recording_url?: string;
  max_participants: number;
}

export default function LiveClassesPage() {
  return (
    <AdminRoute>
      <LiveClassesContent />
    </AdminRoute>
  );
}

function LiveClassesContent() {
  useTranslation();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    teacher_id: "",
    scheduled_at: "",
    duration_minutes: 60,
    meeting_platform: "jitsi",
    max_participants: 100,
    waiting_room_enabled: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sessions
      const sessionsRes = await fetch('/api/admin/sessions', { credentials: 'include' });
      if (sessionsRes.ok) {
        const data = await sessionsRes.json();
        setSessions(data.sessions || []);
      } else {
        const errorData = await sessionsRes.json();
        console.error('Sessions fetch error:', errorData);
        setError(`Failed to load sessions: ${errorData.details || errorData.error || 'Unknown error'}`);
      }

      // Fetch courses
      const coursesRes = await fetch('/api/admin/courses', { credentials: 'include' });
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data.courses || []);
      }

      // Fetch teachers
      const teachersRes = await fetch('/api/admin/teachers', { credentials: 'include' });
      if (teachersRes.ok) {
        const data = await teachersRes.json();
        setTeachers(data.teachers || []);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.title || !formData.course_id || !formData.teacher_id || !formData.scheduled_at) {
      setError("Please fill in all required fields: Title, Course, Teacher, and Date/Time");
      return;
    }

    // Split scheduled_at into date and time for API
    const scheduledDateTime = new Date(formData.scheduled_at);
    if (isNaN(scheduledDateTime.getTime())) {
      setError("Invalid date/time selected");
      return;
    }
    const scheduled_date = scheduledDateTime.toISOString().split('T')[0];
    const scheduled_time = scheduledDateTime.toTimeString().slice(0, 5);

    const submitData = {
      ...formData,
      scheduled_date,
      scheduled_time,
    };
    delete (submitData as { scheduled_at?: string }).scheduled_at;

    console.log('Submitting session data:', JSON.stringify(submitData, null, 2));

    try {
      const response = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('API error response:', data);
        throw new Error(data.error || data.details || 'Failed to create session');
      }

      setSuccess('Live class scheduled successfully!');
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        course_id: "",
        teacher_id: "",
        scheduled_at: "",
        duration_minutes: 60,
        meeting_platform: "jitsi",
        max_participants: 100,
        waiting_room_enabled: false
      });
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this live class?')) return;

    try {
      const response = await fetch(`/api/admin/sessions/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      setSuccess('Live class deleted successfully');
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <DashboardSidebar userType="admin" />

      <div className="lg:ml-72 min-h-screen">
        <main className="p-4 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Live Classes
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Schedule and manage online video classes
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Schedule Live Class
            </button>
          </motion.div>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              {success}
            </motion.div>
          )}

          {/* Search */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search live classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:bg-gray-800 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Sessions List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700/10 flex items-center justify-center">
                          <Video className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{session.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{session.course_title}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 ml-13">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(session.scheduled_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.duration_minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Max {session.max_participants}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                          {session.meeting_platform}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={session.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Join
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredSessions.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No live classes scheduled</p>
                  <p className="text-sm">Click &quot;Schedule Live Class&quot; to create one</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Schedule Live Class
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Quran Recitation Class"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Class description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Course *
                  </label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Teacher *
                  </label>
                  <select
                    required
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min={15}
                    max={180}
                    value={formData.duration_minutes}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 60 : parseInt(value);
                      setFormData({ ...formData, duration_minutes: isNaN(numValue) ? 60 : numValue });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Meeting Platform
                </label>
                <select
                  value={formData.meeting_platform}
                  onChange={(e) => setFormData({ ...formData, meeting_platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="jitsi">Jitsi Meet (Free, Built-in)</option>
                  <option value="zoom">Zoom</option>
                  <option value="google_meet">Google Meet</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Jitsi Meet is free and requires no account. A meeting link will be auto-generated.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Max Participants
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="waiting_room"
                  checked={formData.waiting_room_enabled}
                  onChange={(e) => setFormData({ ...formData, waiting_room_enabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="waiting_room" className="text-sm text-gray-900 dark:text-gray-100">
                  Enable waiting room (teacher must admit students)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
