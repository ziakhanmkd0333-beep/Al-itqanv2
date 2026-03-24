export interface Course {
  id: string;
  code: string;
  title: string;
  slug: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Specialized";
  category: "Quran" | "Arabic Language" | "Fiqh" | "Sarf & Nahw" | "Hadith";
  duration: string;
  schedule: string;
  feeMin: number;
  feeMax: number;
  feeCurrency: string;
  prerequisites: string;
  nextCourse: string;
  description: string;
  learningOutcomes: string[];
  coreBooks: string[];
  image: string;
  status: "published" | "draft" | "archived";
  order: number;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  age: number;
  language: "en" | "ar" | "ur";
  enrolledCourses: string[];
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  avatar?: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
  credentials: string;
  bio: string;
  assignedCourses: string[];
  status: "active" | "inactive";
  avatar?: string;
  whatsapp?: string;
}

export interface Admission {
  id: string;
  studentId: string;
  courseId: string;
  status: "pending" | "approved" | "rejected" | "deferred";
  appliedAt: string;
  reviewedBy?: string;
  notes?: string;
  preferredTiming?: string;
  guardianInfo?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  method: "stripe" | "paypal" | "bank_transfer";
  status: "paid" | "pending" | "failed" | "overdue";
  transactionId?: string;
  paidAt?: string;
  dueDate?: string;
}

export interface Attendance {
  id: string;
  teacherId: string;
  studentId: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "late";
  notes?: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  issuedAt: string;
  downloadUrl?: string;
  certificateNumber: string;
}

export type Language = "en" | "ar" | "ur";

export type Theme = "green" | "light" | "dark";
