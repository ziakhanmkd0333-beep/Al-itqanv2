"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StudentRoute } from "@/components/auth/ProtectedRoute";
import { useTranslation } from "@/hooks/use-translation";
import { getCurrentUser } from "@/lib/supabase-browser";
import {
  Bell,
  CheckCircle,
  Trash2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Info,
  Calendar,
  ChevronRight,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'message' | 'update' | 'reminder';
  is_read: boolean;
  created_at: string;
  sender?: {
    name: string;
    role: string;
  };
}

export default function StudentNotificationsPage() {
  return (
    <StudentRoute>
      <StudentNotificationsContent />
    </StudentRoute>
  );
}

function StudentNotificationsContent() {
  const { t, isRTL } = useTranslation();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.id) {
      setStudentId(user.id);
      fetchNotifications(user.id);
    }
  }, []);

  const fetchNotifications = async (id: string) => {
    try {
      const response = await fetch(`/api/student/notifications?studentId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use mock data for now
      setNotifications([
        {
          id: '1',
          title: 'Welcome to Al-Itqan Institute',
          message: 'We are excited to have you join our Islamic learning journey. Your course will start soon.',
          type: 'announcement',
          is_read: false,
          created_at: new Date().toISOString(),
          sender: { name: 'Admin', role: 'admin' }
        },
        {
          id: '2',
          title: 'Class Schedule Updated',
          message: 'Your next class has been rescheduled to tomorrow at 10:00 AM.',
          type: 'update',
          is_read: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          sender: { name: 'Teacher', role: 'teacher' }
        },
        {
          id: '3',
          title: 'New Assignment Available',
          message: 'A new assignment has been posted for your Quran Tajweed course.',
          type: 'reminder',
          is_read: true,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/student/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id, studentId })
      });

      if (!response.ok) throw new Error('Failed to mark as read');

      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
      // Update locally anyway
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/student/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });

      if (!response.ok) throw new Error('Failed to mark all as read');

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/student/notifications?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete');

      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting:', error);
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      announcement: Info,
      message: MessageSquare,
      update: Calendar,
      reminder: AlertCircle
    };
    const Icon = icons[type] || Bell;
    const colors: Record<string, string> = {
      announcement: "text-blue-500 bg-blue-100",
      message: "text-green-500 bg-green-100",
      update: "text-purple-500 bg-purple-100",
      reminder: "text-orange-500 bg-orange-100"
    };
    return { Icon, color: colors[type] || colors.announcement };
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <DashboardSidebar userType="student" />
        <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="student" />

      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-8 h-8 text-[var(--primary)]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                  {t("notifications.title") || "Notifications"}
                </h1>
                <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                  {t("notifications.subtitle") || "Stay updated with announcements and messages"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${filter === 'all' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  {t("notifications.all") || "All"}
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${filter === 'unread' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  {t("notifications.unread") || "Unread"} ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("notifications.markAllRead") || "Mark all read"}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-[var(--border)] overflow-hidden"
        >
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p>{t("notifications.noNotifications") || "No notifications"}</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              <AnimatePresence>
                {filteredNotifications.map((notification) => {
                  const { Icon, color } = getTypeIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 hover:bg-[var(--background)] transition-colors cursor-pointer ${
                        !notification.is_read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => {
                        setSelectedNotification(notification);
                        if (!notification.is_read) markAsRead(notification.id);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-[var(--text-primary)] ${!notification.is_read ? 'font-bold' : ''}`}>
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                            <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                            {notification.sender && (
                              <span className="flex items-center gap-1">
                                <ChevronRight className="w-3 h-3" />
                                {notification.sender.name} ({notification.sender.role})
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Detail Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl border border-[var(--border)] w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const { Icon, color } = getTypeIcon(selectedNotification.type);
                    return (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                      {selectedNotification.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {new Date(selectedNotification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 hover:bg-[var(--background)] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-[var(--text-primary)] mb-6">
                {selectedNotification.message}
              </div>

              {selectedNotification.sender && (
                <div className="bg-[var(--background)] rounded-lg p-4 mb-6">
                  <p className="text-sm text-[var(--text-muted)]">
                    {t("notifications.from") || "From"}: {selectedNotification.sender.name}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {t("notifications.role") || "Role"}: {selectedNotification.sender.role}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  {t("common.close") || "Close"}
                </button>
                {!selectedNotification.is_read && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification.id);
                      setSelectedNotification({ ...selectedNotification, is_read: true });
                    }}
                    className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    {t("notifications.markAsRead") || "Mark as Read"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
