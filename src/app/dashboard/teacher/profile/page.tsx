"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TeacherRoute } from "@/components/auth/ProtectedRoute";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Camera,
  Save,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function TeacherProfilePage() {
  return (
    <TeacherRoute>
      <TeacherProfileContent />
    </TeacherRoute>
  );
}

function TeacherProfileContent() {
  const { t, isRTL } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    qualifications: "",
    bio: "",
    specialization: "",
    photo_url: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/profile', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          full_name: data.teacher.full_name || "",
          email: data.teacher.users?.email || data.teacher.email || "",
          phone: data.teacher.phone || "",
          country: data.teacher.country || "",
          qualifications: data.teacher.qualifications || "",
          bio: data.teacher.bio || "",
          specialization: data.teacher.specialization || "",
          photo_url: data.teacher.photo_url || ""
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/teacher/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="teacher" />
      
      <main className={`min-h-screen p-4 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-[var(--text-primary)] text-3xl font-bold mb-2 ${isRTL ? "arabic-text" : ""}`}>
            {t("teacher.profile.title") || "My Profile"}
          </h1>
          <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
            {t("teacher.profile.subtitle") || "View and update your profile information"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-2xl border border-[var(--border)] p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {formData.photo_url ? (
                  <Image
                    src={formData.photo_url}
                    alt={formData.full_name}
                    fill
                    className="rounded-full object-cover border-4 border-[var(--primary)]"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[var(--primary)]/10 flex items-center justify-center border-4 border-[var(--primary)]">
                    <User className="w-16 h-16 text-[var(--primary)]" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--primary-dark)] transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">{formData.full_name}</h2>
              <p className="text-[var(--text-muted)] mb-4">{formData.specialization}</p>
              
              <div className={`flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Mail className="w-4 h-4" />
                <span>{formData.email}</span>
              </div>
              
              {formData.phone && (
                <div className={`flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Phone className="w-4 h-4" />
                  <span>{formData.phone}</span>
                </div>
              )}
              
              {formData.country && (
                <div className={`flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] ${isRTL ? "flex-row-reverse" : ""}`}>
                  <MapPin className="w-4 h-4" />
                  <span>{formData.country}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-[var(--border)] p-6">
              <h2 className={`text-lg font-bold text-[var(--text-primary)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                {t("teacher.profile.editTitle") || "Edit Profile"}
              </h2>

              {success && (
                <div className={`flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CheckCircle className="w-5 h-5" />
                  <span>{t("teacher.profile.saved") || "Profile updated successfully!"}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    <User className="w-4 h-4 inline mr-2" />
                    {t("teacher.profile.fullName") || "Full Name"}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    <Mail className="w-4 h-4 inline mr-2" />
                    {t("teacher.profile.email") || "Email"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background-green)] text-[var(--text-muted)] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    <Phone className="w-4 h-4 inline mr-2" />
                    {t("teacher.profile.phone") || "Phone"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {t("teacher.profile.country") || "Country"}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    {t("teacher.profile.qualifications") || "Qualifications"}
                  </label>
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    {t("teacher.profile.specialization") || "Specialization"}
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
                    {t("teacher.profile.bio") || "Bio / About"}
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  />
                </div>
              </div>

              <div className={`flex justify-end mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t("common.saving") || "Saving..."}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{t("common.saveChanges") || "Save Changes"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
