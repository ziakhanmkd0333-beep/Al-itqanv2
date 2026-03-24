"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

export default function TeacherSchedulePage() {
  return (
    <TeacherRoute>
      <TeacherScheduleContent />
    </TeacherRoute>
  );
}

interface ScheduleItem {
  id: string;
  course_id: string;
  course_title: string;
  student_id: string;
  student_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  session_type: 'individual' | 'group';
  meeting_link?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

function TeacherScheduleContent() {
  const { t, isRTL } = useTranslation();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const weekDays = [
    { id: 0, name: t("schedule.sunday") || "Sunday", short: "Sun" },
    { id: 1, name: t("schedule.monday") || "Monday", short: "Mon" },
    { id: 2, name: t("schedule.tuesday") || "Tuesday", short: "Tue" },
    { id: 3, name: t("schedule.wednesday") || "Wednesday", short: "Wed" },
    { id: 4, name: t("schedule.thursday") || "Thursday", short: "Thu" },
    { id: 5, name: t("schedule.friday") || "Friday", short: "Fri" },
    { id: 6, name: t("schedule.saturday") || "Saturday", short: "Sat" }
  ];

  useEffect(() => {
    fetchSchedule();
    fetchCoursesAndStudents();
  }, [currentWeek]);

  const fetchSchedule = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/teacher/schedule', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setSchedule(data.schedule || []);
      } else {
        setSchedule([]);
      }
    } catch (error) {
      console.error('Schedule fetch error:', error);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesAndStudents = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [coursesRes, studentsRes] = await Promise.all([
        fetch('/api/teacher/courses', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        }),
        fetch('/api/teacher/students/all', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
      ]);

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    return weekDays.map((weekDay, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        ...weekDay,
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
        isToday: new Date().toDateString() === date.toDateString()
      };
    });
  };

  const getScheduleForDay = (dayId: number) => {
    return schedule.filter(item => item.day_of_week === dayId)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <DashboardSidebar userType="teacher" />
        <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"} flex items-center justify-center`}>
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </main>
      </div>
    );
  }

  const weekDates = getWeekDates();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="teacher" />
      
      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div>
              <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.schedule.title") || "My Schedule"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.schedule.subtitle") || "Manage your weekly teaching schedule"}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className={`flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Plus className="w-5 h-5" />
              <span>{t("teacher.schedule.addSession") || "Add Session"}</span>
            </button>
          </div>
        </motion.div>

        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-[var(--background-green)] rounded-lg transition-colors"
          >
            <ChevronLeft className={`w-6 h-6 text-[var(--text-secondary)] ${isRTL ? "rotate-180" : ""}`} />
          </button>
          <h2 className={`text-lg font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
            {weekDates[0].fullDate} - {weekDates[6].fullDate}
          </h2>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-[var(--background-green)] rounded-lg transition-colors"
          >
            <ChevronRight className={`w-6 h-6 text-[var(--text-secondary)] ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </motion.div>

        {/* Weekly Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-7 gap-2 mb-6"
        >
          {weekDates.map((day) => {
            const daySchedule = getScheduleForDay(day.id);
            const isSelected = selectedDay === day.id;
            
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(isSelected ? null : day.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  day.isToday 
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                    : isSelected
                      ? 'border-[var(--primary)] bg-[var(--background-green)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                }`}
              >
                <p className={`text-xs text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{day.short}</p>
                <p className={`text-2xl font-bold text-[var(--text-primary)] ${day.isToday ? 'text-[var(--primary)]' : ''}`}>
                  {day.date}
                </p>
                {daySchedule.length > 0 && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs">
                      {daySchedule.length} {t("teacher.schedule.sessions") || "sessions"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Daily Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-[var(--border)] overflow-hidden"
        >
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className={`text-lg font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
              {selectedDay !== null 
                ? `${weekDays[selectedDay].name} - ${getScheduleForDay(selectedDay).length} ${t("teacher.schedule.sessions") || "sessions"}`
                : t("teacher.schedule.allSessions") || "All Sessions"
              }
            </h2>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {(selectedDay !== null ? getScheduleForDay(selectedDay) : schedule).length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                  {t("teacher.schedule.noSessions") || "No sessions scheduled"}
                </p>
              </div>
            ) : (
              (selectedDay !== null ? getScheduleForDay(selectedDay) : schedule).map((item) => (
                <div key={item.id} className="p-4 hover:bg-[var(--background-green)] transition-colors">
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-20 text-center">
                      <p className="text-sm font-medium text-[var(--primary)]">{item.start_time}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.end_time}</p>
                    </div>
                    
                    <div className="flex-1">
                      <div className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                        <h3 className="font-semibold text-[var(--text-primary)]">{item.course_title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          item.session_type === 'individual' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.session_type}
                        </span>
                      </div>
                      
                      <div className={`flex items-center gap-2 text-sm text-[var(--text-muted)] ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Users className="w-4 h-4" />
                        <span>{item.student_name}</span>
                      </div>
                      
                      {item.meeting_link && (
                        <a
                          href={item.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-sm text-[var(--primary)] hover:underline mt-2 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <Video className="w-4 h-4" />
                          <span>{t("teacher.schedule.joinMeeting") || "Join Meeting"}</span>
                        </a>
                      )}
                      
                      {item.location && (
                        <div className={`flex items-center gap-2 text-sm text-[var(--text-muted)] mt-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <button className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                        <Edit2 className="w-4 h-4 text-[var(--text-muted)]" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <div className="bg-card p-4 rounded-xl border border-[var(--border)]">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{schedule.length}</p>
                <p className="text-sm text-[var(--text-muted)]">{t("teacher.schedule.totalSessions") || "Total Sessions"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-[var(--border)]">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {schedule.filter(s => s.session_type === 'individual').length}
                </p>
                <p className="text-sm text-[var(--text-muted)]">{t("teacher.schedule.individual") || "Individual"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-[var(--border)]">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {schedule.filter(s => s.session_type === 'group').length}
                </p>
                <p className="text-sm text-[var(--text-muted)]">{t("teacher.schedule.group") || "Group"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl"
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <p className={`text-sm text-yellow-800 ${isRTL ? "arabic-text" : ""}`}>
              {t("teacher.schedule.comingSoon") || "Schedule management features coming soon. For now, please contact admin to schedule sessions."}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
