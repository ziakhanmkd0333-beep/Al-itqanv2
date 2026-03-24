"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Bell,
  Shield,
  Save,
  CheckCircle,
  Calendar,
  BookOpen
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function StudentProfilePage() {
  const { t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: "Ahmed Khan",
    email: "ahmed.khan@email.com",
    phone: "+1-234-567-8901",
    country: "United States",
    city: "New York",
    dateOfBirth: "1995-05-15",
    language: "en",
    timezone: "UTC-5"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    classReminders: true,
    courseUpdates: true,
    certificateAlerts: true,
    promotionalEmails: false,
    smsNotifications: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSaveProfile = () => {
    alert("Profile saved successfully!");
  };

  const handleSaveNotifications = () => {
    alert("Notification settings saved!");
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar userType="student" />

      <main className={`p-6 ${isRTL ? "mr-64" : "ml-64"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <User className="w-8 h-8 text-emerald-600" />
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="text-4xl text-emerald-600 dark:text-emerald-400 font-bold">A</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profileForm.fullName}</h2>
                <p className="text-gray-500 dark:text-gray-400">{profileForm.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {profileForm.city}, {profileForm.country}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    2 Courses Enrolled
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Joined Jan 2025
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium text-center">
                  Active Student
                </div>
                <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium text-center">
                  2 Certificates
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Tabs Sidebar */}
            <div className="w-48 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Personal Information
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={profileForm.dateOfBirth}
                            onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            value={profileForm.country}
                            onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="UAE">United Arab Emirates</option>
                            <option value="India">India</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language Preference
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            value={profileForm.language}
                            onChange={(e) => setProfileForm({ ...profileForm, language: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="ur">اردو</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={profileForm.timezone}
                          onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="UTC-12">UTC-12</option>
                          <option value="UTC-8">UTC-8 (PST)</option>
                          <option value="UTC-5">UTC-5 (EST)</option>
                          <option value="UTC+0">UTC+0 (GMT)</option>
                          <option value="UTC+5">UTC+5 (PKT)</option>
                          <option value="UTC+5:30">UTC+5:30 (IST)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-emerald-600" />
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {[
                      { key: "classReminders", title: "Class Reminders", description: "Get reminders before your scheduled classes" },
                      { key: "courseUpdates", title: "Course Updates", description: "Receive updates about your enrolled courses" },
                      { key: "certificateAlerts", title: "Certificate Alerts", description: "Get notified when you earn a new certificate" },
                      { key: "promotionalEmails", title: "Promotional Emails", description: "Receive news and special offers from the academy" },
                      { key: "smsNotifications", title: "SMS Notifications", description: "Get important alerts via SMS" }
                    ].map((setting) => (
                      <div key={setting.key} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{setting.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, [setting.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSaveNotifications}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <button
                          onClick={handleChangePassword}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Current Session</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Chrome on Windows • New York, US</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 font-medium">Active Now</span>
                        </div>
                      </div>
                      <button className="mt-4 text-sm text-red-600 hover:underline">
                        Sign out of all other sessions
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
