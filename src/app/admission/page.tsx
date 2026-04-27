"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { createBrowserClient } from "@supabase/ssr";
import { courses } from "@/lib/courses-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Send, CheckCircle, User, Mail, Phone, BookOpen, Calendar,
  Lock, Eye, EyeOff, GraduationCap, FileText, Award, Briefcase,
  Upload, X, FileCheck, FileUp
} from "lucide-react";

// Floating particles for background - will be generated client-side only
interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

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

// Previous Education Type
interface PreviousEducation {
  id: string;
  educationType: 'general' | 'islamic';
  institutionName: string;
  degreeTitle: string;
  completionYear: string;
}



export default function AdmissionPage() {
  const { t, isRTL } = useTranslation();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");
  

  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    age: "",
    language: "en"
  });

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [profilePictureName, setProfilePictureName] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  // Certificate URLs State
  const [certificateUrls, setCertificateUrls] = useState<string[]>([]);

  // Previous Education State
  const [previousEducation, setPreviousEducation] = useState<PreviousEducation[]>([
    { id: "1", educationType: "general", institutionName: "", degreeTitle: "", completionYear: "" }
  ]);

  // Certificates State
  const [certificateNames, setCertificateNames] = useState<string[]>([]);

  // Course Selection State
  const [courseSelection, setCourseSelection] = useState({
    courseId: "",
    preferredTiming: "",
    startDate: "",
    guardianName: "",
    guardianPhone: "",
    message: ""
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  });
  
  // Teacher form state
  const [teacherForm, setTeacherForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    qualification: "",
    experience: "",
    specialization: "",
    languagesKnown: [] as string[],
    cvFile: null as File | null,
    certFile: null as File | null,
    certificationFile: null as File | null,
    password: "",
    confirmPassword: "",
    message: ""
  });
  const [cvFileName, setCvFileName] = useState("");
  const [certFileName, setCertFileName] = useState("");
  const [cvFileUrl, setCvFileUrl] = useState<string | null>(null);
  const [certFileUrl, setCertFileUrl] = useState<string | null>(null);

  // Teacher form options
  const qualifications = ["High School", "Bachelor's", "Master's", "PhD", "Other"];
  const experienceOptions = ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Generate particles client-side only to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    setParticles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 15 + Math.random() * 10
      }))
    );
  }, []);
  
  // Refs for file inputs
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const certificatesRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  // Check if minor
  const checkMinor = (age: string) => {
    setIsMinor(parseInt(age) < 18);
  };

  // Handle personal info change
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
    if (name === "age") checkMinor(value);
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle course selection change
  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseSelection(prev => ({ ...prev, [name]: value }));
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Add previous education entry
  const addPreviousEducation = () => {
    const newId = (previousEducation.length + 1).toString();
    setPreviousEducation(prev => [
      ...prev,
      { id: newId, educationType: "general", institutionName: "", degreeTitle: "", completionYear: "" }
    ]);
  };

  // Remove previous education entry
  const removePreviousEducation = (id: string) => {
    if (previousEducation.length > 1) {
      setPreviousEducation(prev => prev.filter(edu => edu.id !== id));
    }
  };

  // Update previous education
  const updatePreviousEducation = (id: string, field: string, value: string | number) => {
    setPreviousEducation(prev =>
      prev.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  // Supabase upload function for profile picture
  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    try {
      const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('admission-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Profile upload error:', uploadError);
        setError(`Failed to upload profile picture: ${uploadError.message}`);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('admission-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Profile upload exception:', err);
      setError('Failed to upload profile picture');
      return null;
    }
  };

  // Supabase upload function for certificates
  const uploadCertificate = async (file: File): Promise<string | null> => {
    try {
      const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
      const fileExt = file.name.split('.').pop();
      const fileName = `cert-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('admission-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Certificate upload error:', uploadError);
        setError(`Failed to upload certificate: ${uploadError.message}`);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('admission-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Certificate upload exception:', err);
      setError('Failed to upload certificate');
      return null;
    }
  };

  // Generic file upload function for teacher documents
  const uploadTeacherFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('admission-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('File upload error:', uploadError);
        setError(`Failed to upload ${folder}: ${uploadError.message}`);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('admission-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('File upload exception:', err);
      setError(`Failed to upload ${folder}`);
      return null;
    }
  };

  // Handle profile picture upload with Supabase
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Profile picture must be less than 2MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      setIsUploading(true);
      setError("");
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload to Supabase
      const publicUrl = await uploadProfilePicture(file);
      if (publicUrl) {
        setProfilePicture(file);
        setProfilePictureName(file.name);
        setProfilePictureUrl(publicUrl);
      }
      
      setIsUploading(false);
    }
  };

  // Handle certificates upload with Supabase
  const handleCertificatesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setError("");

    const uploadedUrls: string[] = [];
    const uploadedNames: string[] = [];

    for (const file of validFiles) {
      const publicUrl = await uploadCertificate(file);
      if (publicUrl) {
        uploadedUrls.push(publicUrl);
        uploadedNames.push(file.name);
      }
    }

    if (uploadedUrls.length > 0) {
      setCertificateUrls(prev => [...prev, ...uploadedUrls]);
      setCertificateNames(prev => [...prev, ...uploadedNames]);
    }

    setIsUploading(false);
  };

  // Remove certificate
  const removeCertificate = (index: number) => {
    setCertificateNames(prev => prev.filter((_, i) => i !== index));
    setCertificateUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Handle teacher form change
  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeacherForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle language checkbox for teacher
  const handleLanguageToggle = (lang: string) => {
    setTeacherForm(prev => ({
      ...prev,
      languagesKnown: prev.languagesKnown.includes(lang)
        ? prev.languagesKnown.filter(l => l !== lang)
        : [...prev.languagesKnown, lang]
    }));
  };

  // Handle file upload for teacher
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "cv" | "cert") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setIsUploading(true);
      setError("");

      try {
        if (type === "cv") {
          setTeacherForm(prev => ({ ...prev, cvFile: file }));
          setCvFileName(file.name);

          const url = await uploadTeacherFile(file, 'cv');
          if (url) {
            setCvFileUrl(url);
          }
        } else {
          setTeacherForm(prev => ({ ...prev, certificationFile: file }));
          setCertFileName(file.name);

          const url = await uploadTeacherFile(file, 'certification');
          if (url) {
            setCertFileUrl(url);
          }
        }
      } catch (err) {
        console.error('File upload error:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Step validation functions
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!personalInfo.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!personalInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(personalInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!personalInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$/.test(personalInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!personalInfo.country) newErrors.country = "Country is required";
    if (!personalInfo.city.trim()) newErrors.city = "City is required";
    if (!personalInfo.address.trim()) newErrors.address = "Full address is required";
    if (!personalInfo.age) {
      newErrors.age = "Age is required";
    } else if (parseInt(personalInfo.age) < 5 || parseInt(personalInfo.age) > 100) {
      newErrors.age = "Age must be between 5 and 100";
    }
    if (!profilePicture) newErrors.profilePicture = "Profile picture is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!courseSelection.courseId) newErrors.courseId = "Please select a course";
    if (!passwordData.password) {
      newErrors.password = "Password is required";
    } else if (passwordData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (isMinor && !courseSelection.guardianName) {
      newErrors.guardianName = "Guardian name is required for minors";
    }
    if (isMinor && !courseSelection.guardianPhone) {
      newErrors.guardianPhone = "Guardian phone is required for minors";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password
  const validatePassword = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) return "Passwords do not match";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
  };

  // Submit student form (enhanced)
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Final validation
    if (!validateStep1() || !validateStep4()) {
      return;
    }

    const passwordError = validatePassword(passwordData.password, passwordData.confirmPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Personal Info
      formData.append('email', personalInfo.email);
      formData.append('password', passwordData.password);
      formData.append('fullName', personalInfo.fullName);
      formData.append('phone', personalInfo.phone);
      formData.append('country', personalInfo.country);
      formData.append('city', personalInfo.city);
      formData.append('address', personalInfo.address);
      formData.append('age', personalInfo.age);
      formData.append('language', personalInfo.language);
      formData.append('role', 'Student');
      
      // Profile Picture URL from Supabase
      if (profilePictureUrl) {
        formData.append('profilePictureUrl', profilePictureUrl);
      }
      
      // Course Selection
      formData.append('courseId', courseSelection.courseId);
      formData.append('preferredTiming', courseSelection.preferredTiming);
      formData.append('startDate', courseSelection.startDate);
      if (isMinor) {
        formData.append('guardianName', courseSelection.guardianName);
        formData.append('guardianPhone', courseSelection.guardianPhone);
      }
      formData.append('message', courseSelection.message);

      // Previous Education
      formData.append('previousEducation', JSON.stringify(previousEducation));
      
      // Certificate URLs from Supabase
      if (certificateUrls.length > 0) {
        formData.append('certificateUrls', JSON.stringify(certificateUrls));
      }

      const response = await fetch('/api/register/enhanced', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit teacher form
  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(teacherForm.password, teacherForm.confirmPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!teacherForm.cvFile) {
      setError("CV/Resume is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('email', teacherForm.email);
      formData.append('password', teacherForm.password);
      formData.append('fullName', teacherForm.fullName);
      formData.append('phone', teacherForm.phone);
      formData.append('country', teacherForm.country);
      formData.append('qualification', teacherForm.qualification);
      formData.append('experience', teacherForm.experience);
      formData.append('specialization', teacherForm.specialization);
      formData.append('languagesKnown', JSON.stringify(teacherForm.languagesKnown));
      if (cvFileUrl) formData.append('cvFileUrl', cvFileUrl);
      if (certFileUrl) formData.append('certificationFileUrl', certFileUrl);

      const response = await fetch('/api/register/teacher', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <main className="min-h-screen" suppressHydrationWarning>
        <Navbar />
        <section className="pt-32 pb-20 bg-[var(--background)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-3xl p-8 md:p-12 text-center shadow-xl border border-[var(--border)]"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {t("admission.success.status")}
              </div>
              <h2 className={`text-[var(--text-primary)] text-2xl md:text-3xl font-bold mb-4 ${isRTL ? "arabic-text" : ""}`}>
                {t("admission.success.title")}
              </h2>
              <p className={`text-[var(--text-secondary)] mb-6 ${isRTL ? "arabic-text" : ""}`}>
                {t("admission.success.description")}
              </p>
              <div className="bg-[var(--background-green)] rounded-xl p-6 mb-6">
                <p className={`text-[var(--text-muted)] text-sm mb-2 ${isRTL ? "arabic-text text-right" : ""}`}>
                  {t("admission.success.whatNext")}
                </p>
                <ol className={`text-[var(--text-secondary)] text-sm space-y-2 ${isRTL ? "arabic-text text-right" : "text-left"}`}>
                  <li>{isRTL ? "1. " : "1. "}{t("admission.success.step1")}</li>
                  <li>{isRTL ? "2. " : "2. "}{t("admission.success.step2")}</li>
                  <li>{isRTL ? "3. " : "3. "}{t("admission.success.step3")}</li>
                  <li>{isRTL ? "4. " : "4. "}{t("admission.success.step4")}</li>
                </ol>
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
                <Link
                  href="/auth/login"
                  className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  {t("admission.success.login")}
                </Link>
                <Link
                  href="/"
                  className="inline-block bg-[var(--background-green)] hover:bg-[var(--primary)]/10 text-[var(--primary)] px-8 py-3 rounded-xl font-semibold transition-colors border border-[var(--primary)]"
                >
                  {t("admission.success.home")}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <Navbar />
      
      {/* Header - Enhanced Hero Section */}
      <section className="relative pt-32 pb-16 min-h-[55vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/admission-hero.png"
            alt={t("admission.title")}
            fill
            className="object-cover"
            priority
            suppressHydrationWarning
          />
          
          {/* Gradient Overlay - Enhanced with multiple layers */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(13, 77, 47, 0.92) 0%, rgba(26, 122, 74, 0.88) 30%, rgba(13, 77, 47, 0.92) 100%)"
            }}
          />

          {/* Radial Glow Effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, transparent 60%)"
            }}
          />

          {/* Animated Islamic Geometric Overlay */}
          <div className="absolute inset-0 opacity-15">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="admission-hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path
                    d="M60 0L120 30L120 90L60 120L0 90L0 30Z"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M60 15L105 30L105 90L60 105L15 90L15 30Z"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="0.4"
                  />
                  <circle cx="60" cy="60" r="20" fill="none" stroke="#C9A84C" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#admission-hero-pattern)" />
            </svg>
          </div>

          {/* Floating Particles */}
          <div suppressHydrationWarning>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full bg-[#C9A84C]/30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          </div>

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-center"
          >
            {/* Bismillah */}
            <motion.div
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <p className="arabic-text text-[#C9A84C] text-2xl md:text-3xl lg:text-4xl leading-relaxed relative">
                <span className="absolute -inset-4 bg-[#C9A84C]/10 rounded-full blur-xl" />
                <span className="relative">{t("hero.bismillah")}</span>
              </p>
            </motion.div>

            {/* Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] text-sm font-semibold uppercase tracking-wider" suppressHydrationWarning>
                {t("admission.subtitle")}
              </span>
            </motion.div>

            {/* Main Title with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 ${isRTL ? "arabic-text" : ""}`}
              style={{
                textShadow: "0 4px 30px rgba(0,0,0,0.5)"
              }}
            >
              <span className="bg-gradient-to-r from-white via-white to-[#C9A84C] bg-clip-text text-transparent" suppressHydrationWarning>
                {t("admission.title")}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isRTL ? "arabic-text" : ""}`}
              suppressHydrationWarning
            >
              {t("admission.description")}
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          className="absolute bottom-20 left-10 w-24 h-24"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="absolute inset-0 border border-[#C9A84C]/20 rounded-full animate-rotate-slow" />
          <div className="absolute inset-2 border border-[#C9A84C]/10 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
        </motion.div>

        <motion.div 
          className="absolute top-40 right-10 w-32 h-32"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="absolute inset-0 border border-[#C9A84C]/10 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse" }} />
          <div className="absolute inset-4 border border-[#C9A84C]/5 rounded-full animate-rotate-slow" style={{ animationDuration: "25s" }} />
        </motion.div>
      </section>

      {/* Form */}
      <section className="py-12 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border border-[var(--border)]"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Tab Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-8 ${isRTL ? "flex-row-reverse" : ""}`} suppressHydrationWarning>
              <button
                type="button"
                onClick={() => setActiveTab("student")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                  activeTab === "student"
                    ? "bg-[var(--primary)] text-white shadow-lg"
                    : "bg-[var(--background-green)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
                } ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                suppressHydrationWarning
              >
                <User className="w-5 h-5" />
                {t("admission.registerStudent")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("teacher")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                  activeTab === "teacher"
                    ? "bg-[var(--primary)] text-white shadow-lg"
                    : "bg-[var(--background-green)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
                } ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                suppressHydrationWarning
              >
                <GraduationCap className="w-5 h-5" />
                {t("admission.registerTeacher")}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "student" ? (
                <motion.form
                  key="student-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleStudentSubmit}
                >
                  <div className="mb-8">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`} suppressHydrationWarning>
                      <User className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.personalInfo")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.fullName")} *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={personalInfo.fullName}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          placeholder={t("admission.placeholders.fullName")}
                          suppressHydrationWarning
                        />
                      </div>

                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.email")} *
                        </label>
                        <div className="relative">
                          <Mail className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="email"
                            name="email"
                            required
                            value={personalInfo.email}
                            onChange={handlePersonalInfoChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.placeholders.email")}
                            suppressHydrationWarning
                          />
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.phone")} *
                        </label>
                        <div className="relative">
                          <Phone className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={personalInfo.phone}
                            onChange={handlePersonalInfoChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.placeholders.phone")}
                            suppressHydrationWarning
                          />
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.country")} *
                        </label>
                        <select
                          name="country"
                          required
                          value={personalInfo.country}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          suppressHydrationWarning
                        >
                          <option value="">{t("admin.admissions.table.country")}</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={personalInfo.city}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          placeholder="Enter your city"
                          suppressHydrationWarning
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          Full Address *
                        </label>
                        <textarea
                          name="address"
                          required
                          value={personalInfo.address}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          placeholder="Enter your complete residential address"
                          rows={3}
                          suppressHydrationWarning
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.age")} *
                        </label>
                        <input
                          type="number"
                          name="age"
                          required
                          min="5"
                          max="100"
                          value={personalInfo.age}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          placeholder={t("admission.placeholders.age")}
                          suppressHydrationWarning
                        />
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.language")} *
                        </label>
                        <select
                          name="language"
                          required
                          value={personalInfo.language}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          suppressHydrationWarning
                        >
                          <option value="en">{t("languages.en")}</option>
                          <option value="ur">{t("languages.ur")}</option>
                          <option value="ar">{t("languages.ar")}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <Upload className="w-5 h-5 text-[var(--primary)]" />
                      Profile Picture (Required)
                    </h2>
                    <div className={`md:col-span-2 ${isRTL ? "text-right" : ""}`}>
                      <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                        Upload Profile Picture * (Max 2MB, JPG/PNG)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={profilePictureRef}
                          onChange={handleProfilePictureUpload}
                          accept="image/jpeg,image/png,image/jpg"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => profilePictureRef.current?.click()}
                          disabled={isUploading}
                          className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text-primary)] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              Choose Photo
                            </>
                          )}
                        </button>
                        {profilePictureName && !isUploading && (
                          <span className="text-sm text-[var(--text-secondary)]">{profilePictureName}</span>
                        )}
                      </div>
                      {errors.profilePicture && <p className="text-red-500 text-sm mt-1">{errors.profilePicture}</p>}
                      {profilePicturePreview && (
                        <div className="mt-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={profilePicturePreview}
                            alt="Profile Preview"
                            width={120}
                            height={120}
                            className="rounded-xl object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Previous Education */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-[var(--text-primary)] text-xl font-bold flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`} suppressHydrationWarning>
                        <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                        Previous Education / Qualifications
                      </h2>
                      <button
                        type="button"
                        onClick={addPreviousEducation}
                        className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg transition-colors text-sm"
                      >
                        + Add Education
                      </button>
                    </div>
                    
                    {previousEducation.map((edu, index) => (
                      <div key={edu.id} className="mb-6 p-4 bg-[var(--surface)] rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">Education {index + 1}</h3>
                          {previousEducation.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePreviousEducation(edu.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-1">Education Type *</label>
                            <select
                              value={edu.educationType}
                              onChange={(e) => updatePreviousEducation(edu.id, 'educationType', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] ${isRTL ? "text-right" : ""}`}
                            >
                              <option value="general">General Education</option>
                              <option value="islamic">Islamic Education</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-1">Institution Name *</label>
                            <input
                              type="text"
                              value={edu.institutionName}
                              onChange={(e) => updatePreviousEducation(edu.id, 'institutionName', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] ${isRTL ? "text-right" : ""}`}
                              placeholder="Institution name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-1">Degree/Title *</label>
                            <input
                              type="text"
                              value={edu.degreeTitle}
                              onChange={(e) => updatePreviousEducation(edu.id, 'degreeTitle', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] ${isRTL ? "text-right" : ""}`}
                              placeholder="e.g., High School, Bachelor's, Hifz Certificate"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-1">Completion Year</label>
                            <input
                              type="number"
                              min="1900"
                              max="2100"
                              value={edu.completionYear}
                              onChange={(e) => updatePreviousEducation(edu.id, 'completionYear', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] ${isRTL ? "text-right" : ""}`}
                              placeholder="Year of completion"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certificates Upload */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <FileUp className="w-5 h-5 text-[var(--primary)]" />
                      Certificates Upload (Optional)
                    </h2>
                    <div className={`md:col-span-2 ${isRTL ? "text-right" : ""}`}>
                      <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                        Upload Certificates (PDF, JPG, PNG - Max 5MB each)
                      </label>
                      <div className="flex items-center gap-4 mb-4">
                        <input
                          type="file"
                          ref={certificatesRef}
                          onChange={handleCertificatesUpload}
                          accept=".pdf,image/jpeg,image/png"
                          multiple
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => certificatesRef.current?.click()}
                          disabled={isUploading}
                          className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text-primary)] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              Upload Certificates
                            </>
                          )}
                        </button>
                      </div>
                      {certificateNames.length > 0 && (
                        <div className="space-y-2">
                          {certificateNames.map((name, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-[var(--surface)] rounded-lg">
                              <span className="text-sm text-[var(--text-secondary)]">{name}</span>
                              <button
                                type="button"
                                onClick={() => removeCertificate(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <Lock className="w-5 h-5 text-[var(--primary)]" />
                      {t("login.password")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.password")} *
                        </label>
                        <div className="relative">
                          <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            minLength={8}
                            value={passwordData.password}
                            onChange={handlePasswordChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.form.passwordRequirements")}
                            suppressHydrationWarning
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("login.passwordPlaceholder")} *
                        </label>
                        <div className="relative">
                          <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            required
                            minLength={8}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("login.passwordPlaceholder")}
                            suppressHydrationWarning
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Selection */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`} suppressHydrationWarning>
                      <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.courseSelection")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`md:col-span-2 ${isRTL ? "text-right" : ""}`} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.course")} *
                        </label>
                        <select
                          name="courseId"
                          required
                          value={courseSelection.courseId}
                          onChange={handleCourseChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          suppressHydrationWarning
                        >
                          <option value="">{t("admission.form.course")}</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {isRTL ? t(`courseData.${course.id}.title`) : course.title} ({t(`levels.${course.level.toLowerCase()}`)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.timing")} *
                        </label>
                        <select
                          name="preferredTiming"
                          required
                          value={courseSelection.preferredTiming}
                          onChange={handleCourseChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          suppressHydrationWarning
                        >
                          <option value="">{t("admission.form.timing")}</option>
                          <option value="morning">{t("admission.form.timingOptions.morning")}</option>
                          <option value="afternoon">{t("admission.form.timingOptions.afternoon")}</option>
                          <option value="evening">{t("admission.form.timingOptions.evening")}</option>
                          <option value="flexible">{t("admission.form.timingOptions.flexible")}</option>
                        </select>
                      </div>

                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admin.admissions.table.applied")} *
                        </label>
                        <div className="relative">
                          <Calendar className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="date"
                            name="startDate"
                            required
                            value={courseSelection.startDate}
                            onChange={handleCourseChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            suppressHydrationWarning
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information (for minors) */}
                  {isMinor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 pt-8 border-t border-[var(--border)]"
                    >
                      <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`} suppressHydrationWarning>
                        <User className="w-5 h-5 text-[var(--primary)]" />
                        {t("admission.guardianInfo")}
                        <span className={`text-sm font-normal text-[var(--text-muted)] ${isRTL ? "mr-2" : "ml-2"}`} suppressHydrationWarning>({t("admission.guardianInfoNote")})</span>
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                            {t("admission.form.guardianName")} *
                          </label>
                          <input
                            type="text"
                            name="guardianName"
                            required={isMinor}
                            value={courseSelection.guardianName}
                            onChange={handleCourseChange}
                            className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.form.guardianName")}
                            suppressHydrationWarning
                          />
                        </div>

                        <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                            {t("admission.form.guardianPhone")} *
                          </label>
                          <div className="relative">
                            <Phone className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                            <input
                              type="tel"
                              name="guardianPhone"
                              required={isMinor}
                              value={courseSelection.guardianPhone}
                              onChange={handleCourseChange}
                              className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                              placeholder={t("admission.form.guardianPhone")}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Additional Message */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <FileText className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.additionalMessage")}
                    </h2>

                    <textarea
                      name="message"
                      rows={4}
                      value={teacherForm.message || ""}
                      onChange={(e) => setTeacherForm({...teacherForm, message: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none ${isRTL ? "text-right" : ""}`}
                      placeholder={t("admission.placeholders.message")}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("contact.send")}
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="teacher-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleTeacherSubmit}
                >
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`} suppressHydrationWarning>
                      <User className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.personalInfo")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.fullName")} *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={teacherForm.fullName}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          placeholder={t("admission.placeholders.fullName")}
                          suppressHydrationWarning
                        />
                      </div>

                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.email")} *
                        </label>
                        <div className="relative">
                          <Mail className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="email"
                            name="email"
                            required
                            value={teacherForm.email}
                            onChange={handleTeacherChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.placeholders.email")}
                            suppressHydrationWarning
                          />
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.phone")} *
                        </label>
                        <div className="relative">
                          <Phone className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={teacherForm.phone}
                            onChange={handleTeacherChange}
                            className={`w-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.placeholders.phone")}
                            suppressHydrationWarning
                          />
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.country")} *
                        </label>
                        <select
                          name="country"
                          required
                          value={teacherForm.country}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          suppressHydrationWarning
                        >
                          <option value="">{t("admin.admissions.table.country")}</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`} suppressHydrationWarning>
                      <Briefcase className="w-5 h-5 text-[var(--primary)]" />
                      {t("admission.teacherInfo")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.qualification")} *
                        </label>
                        <select
                          name="qualification"
                          required
                          value={teacherForm.qualification}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          suppressHydrationWarning
                        >
                          <option value="">{t("admission.form.selectQualification")}</option>
                          {qualifications.map((qual: string) => (
                            <option key={qual} value={qual}>{qual}</option>
                          ))}
                        </select>
                      </div>

                      <div className={isRTL ? "text-right" : ""} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.experience")} *
                        </label>
                        <select
                          name="experience"
                          required
                          value={teacherForm.experience}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          suppressHydrationWarning
                        >
                          <option value="">{t("admission.form.selectExperience")}</option>
                          {experienceOptions.map((exp: string) => (
                            <option key={exp} value={exp}>{exp}</option>
                          ))}
                        </select>
                      </div>

                      <div className={`md:col-span-2 ${isRTL ? "text-right" : ""}`} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.specialization")} *
                        </label>
                        <select
                          name="specialization"
                          required
                          value={teacherForm.specialization}
                          onChange={handleTeacherChange}
                          className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                          suppressHydrationWarning
                        >
                          <option value="">{t("admission.form.selectSpecialization")}</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {isRTL ? t(`courseData.${course.id}.title`) : course.title}
                            </option>
                          ))}
                          <option value="all">{t("categories.all")}</option>
                        </select>
                      </div>

                      <div className={`md:col-span-2 ${isRTL ? "text-right" : ""}`} suppressHydrationWarning>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2" suppressHydrationWarning>
                          {t("admission.form.languagesKnown")} *
                        </label>
                        <div className={`flex flex-wrap gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                          {["English", "Urdu", "Arabic", "Hindi", "Punjabi", "Bengali", "Persian", "Other"].map(lang => (
                            <label
                              key={lang}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                                teacherForm.languagesKnown.includes(lang)
                                  ? "bg-[var(--primary)] text-white"
                                  : "bg-[var(--background-green)] text-[var(--text-primary)] hover:bg-[var(--primary)]/10"
                              } ${isRTL ? "arabic-text flex-row-reverse" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={teacherForm.languagesKnown.includes(lang)}
                                onChange={() => handleLanguageToggle(lang)}
                                className="sr-only"
                              />
                              {lang === "English" ? t("languages.en") : 
                               lang === "Urdu" ? t("languages.ur") : 
                               lang === "Arabic" ? t("languages.ar") : lang}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <FileText className="w-5 h-5 text-[var(--primary)]" />
                      {t("admin.sidebar.admissions")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.cvFile")} *
                        </label>
                        <input
                          ref={cvInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, "cv")}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => cvInputRef.current?.click()}
                          className={`w-full py-4 px-4 rounded-xl border-2 border-dashed transition-colors flex items-center justify-center gap-3 ${
                            cvFileName
                              ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                              : "border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-muted)]"
                          } ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {cvFileName ? (
                            <>
                              <FileCheck className="w-5 h-5" />
                              <span className="truncate max-w-[200px]">{cvFileName}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              {t("admission.form.cvPlaceholder")}
                            </>
                          )}
                        </button>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.certificationFile")}
                        </label>
                        <input
                          ref={certInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, "cert")}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => certInputRef.current?.click()}
                          className={`w-full py-4 px-4 rounded-xl border-2 border-dashed transition-colors flex items-center justify-center gap-3 ${
                            certFileName
                              ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                              : "border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-muted)]"
                          } ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {certFileName ? (
                            <>
                              <FileCheck className="w-5 h-5" />
                              <span className="truncate max-w-[200px]">{certFileName}</span>
                            </>
                          ) : (
                            <>
                              <Award className="w-5 h-5" />
                              {t("admission.form.certificationPlaceholder")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="mb-8 pt-8 border-t border-[var(--border)]">
                    <h2 className={`text-[var(--text-primary)] text-xl font-bold mb-6 flex items-center gap-2 ${isRTL ? "arabic-text flex-row-reverse" : ""}`}>
                      <Lock className="w-5 h-5 text-[var(--primary)]" />
                      {t("login.password")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("admission.form.password")} *
                        </label>
                        <div className="relative">
                          <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            minLength={8}
                            value={teacherForm.password}
                            onChange={handleTeacherChange}
                            className={`w-full py-3 ${isRTL ? "pl-12 pr-12" : "pl-12 pr-12"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("admission.form.passwordRequirements")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className={isRTL ? "text-right" : ""}>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                          {t("login.passwordPlaceholder")} *
                        </label>
                        <div className="relative">
                          <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            required
                            minLength={8}
                            value={teacherForm.confirmPassword}
                            onChange={handleTeacherChange}
                            className={`w-full py-3 ${isRTL ? "pl-12 pr-12" : "pl-12 pr-12"} rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors ${isRTL ? "text-right" : ""}`}
                            placeholder={t("login.passwordPlaceholder")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("admission.title")}
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
