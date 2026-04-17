"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { courses } from "@/lib/courses-data";
import { 
  Send, CheckCircle, User, Mail, Phone, MapPin, BookOpen, Clock, Calendar, 
  Lock, Eye, EyeOff, GraduationCap, FileText, Award, Briefcase, Languages,
  Upload, X, FileCheck, Building, CreditCard, ChevronRight, ChevronLeft,
  AlertCircle, Camera, FileUp, Shield, Check
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Types
interface FormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  fullAddress: string;
  profilePicture: File | null;
  
  // Role Selection
  role: "student" | "teacher" | "imam" | "mudarris" | "";
  
  // Student-specific fields
  currentClassGrade: string;
  courseApplyingFor: string;
  schoolInstituteName: string;
  academicDetails: string;
  
  // Teacher-specific fields
  teacherSchoolName: string;
  teachingSubject: string;
  teacherYearsOfExperience: string;
  teacherSchoolCity: string;
  teacherSchoolAddress: string;
  
  // Imam/Khateeb-specific fields
  mosqueName: string;
  mosqueCity: string;
  mosqueAddress: string;
  yearsServingAsImam: string;
  
  // Mudarris-specific fields
  madrasaName: string;
  madrasaCity: string;
  madrasaAddress: string;
  subjectsTeaching: string[];
  mudarrisYearsOfExperience: string;
  
  // Islamic Education Qualifications
  nazira: {
    enabled: boolean;
    details: string;
    institution: string;
    completionYear: string;
  };
  hifz: {
    enabled: boolean;
    details: string;
    institution: string;
    completionYear: string;
    juzCount: string;
  };
  tarjama: {
    enabled: boolean;
    details: string;
    institution: string;
    completionYear: string;
  };
  tafseer: {
    enabled: boolean;
    details: string;
    institution: string;
    completionYear: string;
  };
  
  // Previous Education
  previousEducation: {
    id: string;
    educationType: "general" | "islamic";
    institutionName: string;
    degreeTitle: string;
    completionYear: string;
    certificate: File | null;
  }[];
  
  // Password
  password: string;
  confirmPassword: string;
  
  // Additional
  guardianName: string;
  guardianPhone: string;
  message: string;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  fullAddress: "",
  profilePicture: null,
  role: "",
  currentClassGrade: "",
  courseApplyingFor: "",
  schoolInstituteName: "",
  academicDetails: "",
  teacherSchoolName: "",
  teachingSubject: "",
  teacherYearsOfExperience: "",
  teacherSchoolCity: "",
  teacherSchoolAddress: "",
  mosqueName: "",
  mosqueCity: "",
  mosqueAddress: "",
  yearsServingAsImam: "",
  madrasaName: "",
  madrasaCity: "",
  madrasaAddress: "",
  subjectsTeaching: [],
  mudarrisYearsOfExperience: "",
  nazira: { enabled: false, details: "", institution: "", completionYear: "" },
  hifz: { enabled: false, details: "", institution: "", completionYear: "", juzCount: "" },
  tarjama: { enabled: false, details: "", institution: "", completionYear: "" },
  tafseer: { enabled: false, details: "", institution: "", completionYear: "" },
  previousEducation: [],
  password: "",
  confirmPassword: "",
  guardianName: "",
  guardianPhone: "",
  message: ""
};

// Country list
const countries = [
  "Afghanistan", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", 
  "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt", "France", 
  "Germany", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
  "Italy", "Japan", "Jordan", "Kenya", "Kuwait", "Libya", "Malaysia", 
  "Mexico", "Morocco", "Netherlands", "Nigeria", "Norway", "Oman", "Pakistan", 
  "Palestine", "Philippines", "Poland", "Portugal", "Qatar", "Russia", 
  "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", 
  "Sweden", "Switzerland", "Syria", "Thailand", "Turkey", "UAE", "UK", 
  "Ukraine", "USA", "Yemen", "Other"
];

// Class/Grade options
const classGrades = [
  "No Formal Education", "Primary School", "Middle School", "High School", 
  "Undergraduate", "Graduate", "Post Graduate", "Other"
];

// Experience options
const experienceOptions = [
  "Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10+ years"
];

// Subject options for Mudarris
const teachingSubjects = [
  "Quran Recitation (Nazira)", "Quran Memorization (Hifz)", "Tajweed", 
  "Arabic Language", "Fiqh", "Aqeedah", "Seerah", "Hadith", 
  "Tafseer", "Sarf & Nahw", "Islamic History", "Duas & Adhkar"
];

// Year options
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export default function EnhancedAdmissionPage() {
  const { t } = useTranslation();
  const router = useRouter();
  
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isMinor, setIsMinor] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  
  // Check if minor based on class/grade
  useEffect(() => {
    const minorGrades = ["Primary School", "Middle School"];
    setIsMinor(minorGrades.includes(formData.currentClassGrade));
  }, [formData.currentClassGrade]);
  
  // Validation functions
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
          newErrors.phone = "Invalid phone number format";
        }
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.fullAddress.trim()) newErrors.fullAddress = "Full address is required";
        if (!formData.profilePicture) newErrors.profilePicture = "Profile picture is required";
        break;
        
      case 2: // Role Selection
        if (!formData.role) newErrors.role = "Please select a role";
        break;
        
      case 3: // Role-Specific Information
        if (formData.role === "student") {
          if (!formData.currentClassGrade) newErrors.currentClassGrade = "Current class/grade is required";
          if (!formData.schoolInstituteName.trim()) newErrors.schoolInstituteName = "School/Institute name is required";
        } else if (formData.role === "teacher") {
          if (!formData.teacherSchoolName.trim()) newErrors.teacherSchoolName = "School name is required";
          if (!formData.teachingSubject.trim()) newErrors.teachingSubject = "Teaching subject is required";
          if (!formData.teacherYearsOfExperience) newErrors.teacherYearsOfExperience = "Years of experience is required";
        } else if (formData.role === "imam") {
          if (!formData.mosqueName.trim()) newErrors.mosqueName = "Mosque name is required";
          if (!formData.mosqueCity.trim()) newErrors.mosqueCity = "City is required";
          if (!formData.mosqueAddress.trim()) newErrors.mosqueAddress = "Mosque address is required";
        } else if (formData.role === "mudarris") {
          if (!formData.madrasaName.trim()) newErrors.madrasaName = "Madrasa name is required";
          if (!formData.madrasaCity.trim()) newErrors.madrasaCity = "City is required";
          if (!formData.madrasaAddress.trim()) newErrors.madrasaAddress = "Madrasa address is required";
          if (formData.subjectsTeaching.length === 0) newErrors.subjectsTeaching = "At least one subject is required";
        }
        break;
        
      case 4: // Islamic Education Qualifications
        // At least one qualification should be enabled
        const hasQualification = formData.nazira.enabled || formData.hifz.enabled || 
                                formData.tarjama.enabled || formData.tafseer.enabled;
        if (!hasQualification) {
          newErrors.qualifications = "At least one Islamic education qualification is required";
        }
        // Validate enabled qualifications
        if (formData.nazira.enabled && !formData.nazira.details.trim()) {
          newErrors.naziraDetails = "Nazira details are required";
        }
        if (formData.hifz.enabled && !formData.hifz.details.trim()) {
          newErrors.hifzDetails = "Hifz details are required";
        }
        if (formData.tarjama.enabled && !formData.tarjama.details.trim()) {
          newErrors.tarjamaDetails = "Tarjama details are required";
        }
        if (formData.tafseer.enabled && !formData.tafseer.details.trim()) {
          newErrors.tafseerDetails = "Tafseer details are required";
        }
        break;
        
      case 5: // Password & Guardian
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else {
          if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
          if (!/[A-Z]/.test(formData.password)) newErrors.password = "Password must contain at least one uppercase letter";
          if (!/[a-z]/.test(formData.password)) newErrors.password = "Password must contain at least one lowercase letter";
          if (!/[0-9]/.test(formData.password)) newErrors.password = "Password must contain at least one number";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        if (isMinor) {
          if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required for minors";
          if (!formData.guardianPhone.trim()) newErrors.guardianPhone = "Guardian phone is required for minors";
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isMinor]);
  
  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };
  
  // Input handlers
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
    }
  };
  
  const handleQualificationChange = (
    qualification: "nazira" | "hifz" | "tarjama" | "tafseer",
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [qualification]: { ...prev[qualification], [field]: value }
    }));
    // Clear error
    if (errors[`${qualification}${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors(prev => { 
        const newErrors = { ...prev }; 
        delete newErrors[`${qualification}${field.charAt(0).toUpperCase() + field.slice(1)}`]; 
        return newErrors; 
      });
    }
  };
  
  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "certificate") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: "Invalid file type. Use JPG, PNG, or PDF" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: "File size must be less than 5MB" }));
      return;
    }
    
    if (type === "profile") {
      handleInputChange("profilePicture", file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  // Subject toggle for Mudarris
  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjectsTeaching: prev.subjectsTeaching.includes(subject)
        ? prev.subjectsTeaching.filter(s => s !== subject)
        : [...prev.subjectsTeaching, subject]
    }));
  };
  
  // Add previous education
  const addPreviousEducation = () => {
    setFormData(prev => ({
      ...prev,
      previousEducation: [
        ...prev.previousEducation,
        {
          id: Math.random().toString(36).substr(2, 9),
          educationType: "general",
          institutionName: "",
          degreeTitle: "",
          completionYear: "",
          certificate: null
        }
      ]
    }));
  };
  
  // Update previous education
  const updatePreviousEducation = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      previousEducation: prev.previousEducation.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };
  
  // Remove previous education
  const removePreviousEducation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      previousEducation: prev.previousEducation.filter(edu => edu.id !== id)
    }));
  };
  
  // Submit handler
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      const submitFormData = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        
        if (key === "profilePicture" && value instanceof File) {
          submitFormData.append("profilePicture", value);
        } else if (key === "previousEducation") {
          // Handle file uploads in previous education
          const educationWithoutFiles = (value as any[]).map(edu => ({
            ...edu,
            certificate: null
          }));
          submitFormData.append("previousEducation", JSON.stringify(educationWithoutFiles));
        } else if (key === "subjectsTeaching") {
          submitFormData.append(key, JSON.stringify(value));
        } else if (key === "nazira" || key === "hifz" || key === "tarjama" || key === "tafseer") {
          submitFormData.append(key, JSON.stringify(value));
        } else {
          submitFormData.append(key, value.toString());
        }
      });
      
      const response = await fetch("/api/register/enhanced", {
        method: "POST",
        body: submitFormData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      setIsSubmitted(true);
    } catch (error: any) {
      setErrors({ submit: error.message || "An error occurred during registration" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Progress bar component
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {["Personal Info", "Role", "Role Details", "Islamic Education", "Password"].map((label, index) => (
          <div key={label} className={`text-xs font-medium ${
            index + 1 <= currentStep ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
          }`}>
            {label}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
  
  // Error message component
  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {errors[field]}
      </p>
    );
  };
  
  // Step 1: Personal Information
  const Step1PersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-emerald-600" />
        Personal Information
      </h3>
      
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center mb-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`w-32 h-32 rounded-full border-2 border-dashed cursor-pointer flex items-center justify-center overflow-hidden transition-all ${
            errors.profilePicture ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
          }`}
        >
          {profilePreview ? (
            <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">Click to upload profile picture</p>
        <ErrorMessage field="profilePicture" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={(e) => handleFileUpload(e, "profile")}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name (as per official documents) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.fullName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500`}
            placeholder="Enter your full name"
          />
          <ErrorMessage field="fullName" />
        </div>
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500`}
            placeholder="your@email.com"
          />
          <ErrorMessage field="email" />
        </div>
        
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500`}
            placeholder="+1234567890"
          />
          <ErrorMessage field="phone" />
        </div>
        
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.country ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500`}
          >
            <option value="">Select Country</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ErrorMessage field="country" />
        </div>
        
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.city ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500`}
            placeholder="Enter your city"
          />
          <ErrorMessage field="city" />
        </div>
      </div>
      
      {/* Full Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.fullAddress}
          onChange={(e) => handleInputChange("fullAddress", e.target.value)}
          rows={3}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.fullAddress ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500`}
          placeholder="Enter your complete residential address"
        />
        <ErrorMessage field="fullAddress" />
      </div>
    </div>
  );
  
  // Step 2: Role Selection
  const Step2RoleSelection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-emerald-600" />
        Select Your Role
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { value: "student", label: "Student", icon: GraduationCap, desc: "Seeking Islamic education" },
          { value: "teacher", label: "Teacher", icon: Briefcase, desc: "Want to teach at our institute" },
          { value: "imam", label: "Imam / Khateeb", icon: Building, desc: "Currently serving at a mosque" },
          { value: "mudarris", label: "Mudarris (Madrassa Teacher)", icon: BookOpen, desc: "Teaching at a madrassa" }
        ].map((role) => {
          const Icon = role.icon;
          const isSelected = formData.role === role.value;
          return (
            <button
              key={role.value}
              onClick={() => handleInputChange("role", role.value)}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                isSelected 
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                  : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600"}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`font-semibold ${isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                    {role.label}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <ErrorMessage field="role" />
    </div>
  );
  
  // Step 3: Role-Specific Information
  const Step3RoleDetails = () => {
    switch (formData.role) {
      case "student":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Class / Grade <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.currentClassGrade}
                  onChange={(e) => handleInputChange("currentClassGrade", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.currentClassGrade ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="">Select Class/Grade</option>
                  {classGrades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <ErrorMessage field="currentClassGrade" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Applying For
                </label>
                <select
                  value={formData.courseApplyingFor}
                  onChange={(e) => handleInputChange("courseApplyingFor", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  School / Institute Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.schoolInstituteName}
                  onChange={(e) => handleInputChange("schoolInstituteName", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.schoolInstituteName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter school or institute name"
                />
                <ErrorMessage field="schoolInstituteName" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Academic Details
                </label>
                <textarea
                  value={formData.academicDetails}
                  onChange={(e) => handleInputChange("academicDetails", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Previous and current academic background"
                />
              </div>
            </div>
          </div>
        );
        
      case "teacher":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Teacher Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.teacherSchoolName}
                  onChange={(e) => handleInputChange("teacherSchoolName", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.teacherSchoolName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter school name"
                />
                <ErrorMessage field="teacherSchoolName" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teaching Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.teachingSubject}
                  onChange={(e) => handleInputChange("teachingSubject", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.teachingSubject ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Primary subject you teach"
                />
                <ErrorMessage field="teachingSubject" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.teacherYearsOfExperience}
                  onChange={(e) => handleInputChange("teacherYearsOfExperience", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.teacherYearsOfExperience ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="">Select Experience</option>
                  {experienceOptions.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <ErrorMessage field="teacherYearsOfExperience" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  School City
                </label>
                <input
                  type="text"
                  value={formData.teacherSchoolCity}
                  onChange={(e) => handleInputChange("teacherSchoolCity", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="School city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  School Address
                </label>
                <input
                  type="text"
                  value={formData.teacherSchoolAddress}
                  onChange={(e) => handleInputChange("teacherSchoolAddress", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="School address"
                />
              </div>
            </div>
          </div>
        );
        
      case "imam":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              Imam / Khateeb Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mosque Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mosqueName}
                  onChange={(e) => handleInputChange("mosqueName", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.mosqueName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter mosque name"
                />
                <ErrorMessage field="mosqueName" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mosqueCity}
                  onChange={(e) => handleInputChange("mosqueCity", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.mosqueCity ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Mosque city"
                />
                <ErrorMessage field="mosqueCity" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years Serving <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.yearsServingAsImam}
                  onChange={(e) => handleInputChange("yearsServingAsImam", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Years</option>
                  {experienceOptions.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Address of Mosque <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.mosqueAddress}
                  onChange={(e) => handleInputChange("mosqueAddress", e.target.value)}
                  rows={2}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.mosqueAddress ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Complete mosque address"
                />
                <ErrorMessage field="mosqueAddress" />
              </div>
            </div>
          </div>
        );
        
      case "mudarris":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Mudarris (Madrassa Teacher) Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Madrasa Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.madrasaName}
                  onChange={(e) => handleInputChange("madrasaName", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.madrasaName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter madrasa name"
                />
                <ErrorMessage field="madrasaName" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.madrasaCity}
                  onChange={(e) => handleInputChange("madrasaCity", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.madrasaCity ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Madrasa city"
                />
                <ErrorMessage field="madrasaCity" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience
                </label>
                <select
                  value={formData.mudarrisYearsOfExperience}
                  onChange={(e) => handleInputChange("mudarrisYearsOfExperience", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Experience</option>
                  {experienceOptions.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Address of Madrasa <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.madrasaAddress}
                  onChange={(e) => handleInputChange("madrasaAddress", e.target.value)}
                  rows={2}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.madrasaAddress ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Complete madrasa address"
                />
                <ErrorMessage field="madrasaAddress" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subjects Teaching <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {teachingSubjects.map(subject => (
                    <label key={subject} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <input
                        type="checkbox"
                        checked={formData.subjectsTeaching.includes(subject)}
                        onChange={() => toggleSubject(subject)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{subject}</span>
                    </label>
                  ))}
                </div>
                <ErrorMessage field="subjectsTeaching" />
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Please select a role first</div>;
    }
  };
  
  // Step 4: Islamic Education Qualifications
  const Step4IslamicEducation = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-emerald-600" />
        Islamic Education Qualifications
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Select the qualifications you have completed and provide details.
      </p>
      
      {errors.qualifications && (
        <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1 mb-4">
          <AlertCircle className="w-4 h-4" /> {errors.qualifications}
        </p>
      )}
      
      {/* Nazira */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={formData.nazira.enabled}
            onChange={(e) => handleQualificationChange("nazira", "enabled", e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded"
          />
          <span className="font-medium text-gray-900 dark:text-white">Nazira (Quran Reading)</span>
        </label>
        {formData.nazira.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
            <input
              type="text"
              placeholder="Details *"
              value={formData.nazira.details}
              onChange={(e) => handleQualificationChange("nazira", "details", e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                errors.naziraDetails ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-sm`}
            />
            <input
              type="text"
              placeholder="Institution Name"
              value={formData.nazira.institution}
              onChange={(e) => handleQualificationChange("nazira", "institution", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <select
              value={formData.nazira.completionYear}
              onChange={(e) => handleQualificationChange("nazira", "completionYear", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="">Completion Year</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
        <ErrorMessage field="naziraDetails" />
      </div>
      
      {/* Hifz */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={formData.hifz.enabled}
            onChange={(e) => handleQualificationChange("hifz", "enabled", e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded"
          />
          <span className="font-medium text-gray-900 dark:text-white">Hifz (Quran Memorization)</span>
        </label>
        {formData.hifz.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
            <input
              type="text"
              placeholder="Details *"
              value={formData.hifz.details}
              onChange={(e) => handleQualificationChange("hifz", "details", e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                errors.hifzDetails ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-sm`}
            />
            <input
              type="text"
              placeholder="Institution Name"
              value={formData.hifz.institution}
              onChange={(e) => handleQualificationChange("hifz", "institution", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <select
              value={formData.hifz.completionYear}
              onChange={(e) => handleQualificationChange("hifz", "completionYear", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="">Completion Year</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <input
              type="number"
              placeholder="Juz Count (e.g., 30)"
              value={formData.hifz.juzCount}
              onChange={(e) => handleQualificationChange("hifz", "juzCount", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              min="1"
              max="30"
            />
          </div>
        )}
        <ErrorMessage field="hifzDetails" />
      </div>
      
      {/* Tarjama */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={formData.tarjama.enabled}
            onChange={(e) => handleQualificationChange("tarjama", "enabled", e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded"
          />
          <span className="font-medium text-gray-900 dark:text-white">Tarjama (Translation)</span>
        </label>
        {formData.tarjama.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
            <input
              type="text"
              placeholder="Details *"
              value={formData.tarjama.details}
              onChange={(e) => handleQualificationChange("tarjama", "details", e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                errors.tarjamaDetails ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-sm`}
            />
            <input
              type="text"
              placeholder="Institution Name"
              value={formData.tarjama.institution}
              onChange={(e) => handleQualificationChange("tarjama", "institution", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <select
              value={formData.tarjama.completionYear}
              onChange={(e) => handleQualificationChange("tarjama", "completionYear", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="">Completion Year</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
        <ErrorMessage field="tarjamaDetails" />
      </div>
      
      {/* Tafseer */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={formData.tafseer.enabled}
            onChange={(e) => handleQualificationChange("tafseer", "enabled", e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded"
          />
          <span className="font-medium text-gray-900 dark:text-white">Tafseer (Exegesis)</span>
        </label>
        {formData.tafseer.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
            <input
              type="text"
              placeholder="Details *"
              value={formData.tafseer.details}
              onChange={(e) => handleQualificationChange("tafseer", "details", e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                errors.tafseerDetails ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-sm`}
            />
            <input
              type="text"
              placeholder="Institution Name"
              value={formData.tafseer.institution}
              onChange={(e) => handleQualificationChange("tafseer", "institution", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <select
              value={formData.tafseer.completionYear}
              onChange={(e) => handleQualificationChange("tafseer", "completionYear", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="">Completion Year</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
        <ErrorMessage field="tafseerDetails" />
      </div>
      
      {/* Previous Education Section */}
      <div className="mt-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          Previous Education / Qualifications
        </h4>
        
        {formData.previousEducation.map((edu, index) => (
          <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Education #{index + 1}</span>
              <button
                onClick={() => removePreviousEducation(edu.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={edu.educationType}
                onChange={(e) => updatePreviousEducation(edu.id, "educationType", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                <option value="general">General Education</option>
                <option value="islamic">Islamic Education</option>
              </select>
              <input
                type="text"
                placeholder="Institution Name *"
                value={edu.institutionName}
                onChange={(e) => updatePreviousEducation(edu.id, "institutionName", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              />
              <input
                type="text"
                placeholder="Degree Title"
                value={edu.degreeTitle}
                onChange={(e) => updatePreviousEducation(edu.id, "degreeTitle", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              />
              <select
                value={edu.completionYear}
                onChange={(e) => updatePreviousEducation(edu.id, "completionYear", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                <option value="">Completion Year</option>
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        ))}
        
        <button
          onClick={addPreviousEducation}
          className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          + Add Previous Education
        </button>
      </div>
    </div>
  );
  
  // Step 5: Password & Guardian
  const Step5Password = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-emerald-600" />
        Account Security
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Create Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10`}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-500"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <ErrorMessage field="password" />
        </div>
        
        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <ErrorMessage field="confirmPassword" />
        </div>
      </div>
      
      {/* Guardian Information for Minors */}
      {isMinor && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Guardian Information (Required for Minors)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Guardian Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.guardianName}
                onChange={(e) => handleInputChange("guardianName", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.guardianName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Guardian's full name"
              />
              <ErrorMessage field="guardianName" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Guardian Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.guardianPhone}
                onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.guardianPhone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Guardian's contact number"
              />
              <ErrorMessage field="guardianPhone" />
            </div>
          </div>
        </div>
      )}
      
      {/* Additional Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Additional Message / Requirements
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Any additional information you'd like to share..."
        />
      </div>
      
      {/* Terms & Privacy */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          By submitting this form, you agree to our{" "}
          <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
          Your information will be securely stored and reviewed by our admin team.
        </p>
      </div>
    </div>
  );
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1PersonalInfo />;
      case 2: return <Step2RoleSelection />;
      case 3: return <Step3RoleDetails />;
      case 4: return <Step4IslamicEducation />;
      case 5: return <Step5Password />;
      default: return null;
    }
  };
  
  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <main className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Thank you for applying to Al-Itqan Institute. Your application has been received and is pending admin review.
                You will be notified via email once your application is approved.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Apply for Admission
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join our community of Islamic learners. Complete all steps to submit your application.
            </p>
          </motion.div>
          
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <ProgressBar />
            </div>
            
            {/* Form Content */}
            <div className="p-6 md:p-8">
              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                  {errors.submit}
                </div>
              )}
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    currentStep === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                {currentStep < 5 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
