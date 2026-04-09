"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  CreditCard,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Receipt,
  Filter,
  Users,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Mail,
  RefreshCw
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";

// Types
interface Payment {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  course_id: string;
  course_name: string;
  amount: number;
  currency: string;
  payment_method: "stripe" | "paypal" | "bank_transfer" | "other";
  status: "paid" | "pending" | "failed" | "refunded";
  transaction_id?: string;
  payment_date?: string;
  due_date: string;
  created_at: string;
  receipt_sent: boolean;
  invoice_number: string;
  notes?: string;
}

// Mock data for development
const mockPayments: Payment[] = [
  {
    id: "1",
    student_id: "s1",
    student_name: "Ahmed Khan",
    student_email: "ahmed@example.com",
    course_id: "1",
    course_name: "Noorani Qaida",
    amount: 25,
    currency: "USD",
    payment_method: "stripe",
    status: "paid",
    transaction_id: "txn_1ABC123XYZ",
    payment_date: "2025-03-10T14:30:00Z",
    due_date: "2025-03-15",
    created_at: "2025-03-01T10:00:00Z",
    receipt_sent: true,
    invoice_number: "INV-2025-001"
  },
  {
    id: "2",
    student_id: "s2",
    student_name: "Fatima Ali",
    student_email: "fatima@example.com",
    course_id: "3",
    course_name: "Quran with Tajweed",
    amount: 35,
    currency: "USD",
    payment_method: "paypal",
    status: "paid",
    transaction_id: "PAYPAL-98765ZYX",
    payment_date: "2025-03-08T09:15:00Z",
    due_date: "2025-03-10",
    created_at: "2025-03-01T10:00:00Z",
    receipt_sent: true,
    invoice_number: "INV-2025-002"
  },
  {
    id: "3",
    student_id: "s3",
    student_name: "Muhammad Hassan",
    student_email: "hassan@example.com",
    course_id: "5",
    course_name: "Hifz-ul-Quran",
    amount: 50,
    currency: "USD",
    payment_method: "stripe",
    status: "pending",
    due_date: "2025-03-20",
    created_at: "2025-03-05T11:30:00Z",
    receipt_sent: false,
    invoice_number: "INV-2025-003"
  },
  {
    id: "4",
    student_id: "s4",
    student_name: "Aisha Rahman",
    student_email: "aisha@example.com",
    course_id: "8",
    course_name: "Beginner Arabic",
    amount: 30,
    currency: "USD",
    payment_method: "bank_transfer",
    status: "pending",
    due_date: "2025-03-18",
    created_at: "2025-03-07T08:45:00Z",
    receipt_sent: false,
    invoice_number: "INV-2025-004"
  },
  {
    id: "5",
    student_id: "s5",
    student_name: "Omar Farooq",
    student_email: "omar@example.com",
    course_id: "21",
    course_name: "Basic Hadith",
    amount: 25,
    currency: "USD",
    payment_method: "stripe",
    status: "failed",
    due_date: "2025-03-12",
    created_at: "2025-03-02T16:20:00Z",
    receipt_sent: false,
    invoice_number: "INV-2025-005",
    notes: "Payment declined - insufficient funds"
  },
  {
    id: "6",
    student_id: "s6",
    student_name: "Zainab Siddiqui",
    student_email: "zainab@example.com",
    course_id: "12",
    course_name: "Basic Fiqh (Qudoori)",
    amount: 25,
    currency: "USD",
    payment_method: "paypal",
    status: "refunded",
    transaction_id: "PAYPAL-REFUND-001",
    payment_date: "2025-03-05T10:00:00Z",
    due_date: "2025-03-10",
    created_at: "2025-02-28T09:00:00Z",
    receipt_sent: true,
    invoice_number: "INV-2025-006",
    notes: "Course cancelled - full refund issued"
  },
  {
    id: "7",
    student_id: "s7",
    student_name: "Ibrahim Malik",
    student_email: "ibrahim@example.com",
    course_id: "1",
    course_name: "Noorani Qaida",
    amount: 25,
    currency: "USD",
    payment_method: "stripe",
    status: "paid",
    transaction_id: "txn_1DEF456UVW",
    payment_date: "2025-03-12T11:45:00Z",
    due_date: "2025-03-15",
    created_at: "2025-03-08T14:00:00Z",
    receipt_sent: true,
    invoice_number: "INV-2025-007"
  },
  {
    id: "8",
    student_id: "s8",
    student_name: "Sarah Johnson",
    student_email: "sarah@example.com",
    course_id: "6",
    course_name: "Tarjamat-ul-Quran",
    amount: 40,
    currency: "USD",
    payment_method: "stripe",
    status: "pending",
    due_date: "2025-03-25",
    created_at: "2025-03-10T12:30:00Z",
    receipt_sent: false,
    invoice_number: "INV-2025-008"
  }
];

const paymentMethods = [
  { value: "stripe", label: "Credit Card (Stripe)" },
  { value: "paypal", label: "PayPal" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" }
];

export default function PaymentsManagementPage() {
  const { t, isRTL } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const itemsPerPage = 10;

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/payments?page=1&limit=100');
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        
        // Transform backend data to match frontend interface
        const transformedPayments: Payment[] = (data.payments || []).map((p: Record<string, unknown>) => ({
          id: p.id,
          student_id: p.student_id || '',
          student_name: p.student_name || 'Unknown',
          student_email: p.student_email || '',
          course_id: p.course_id || '',
          course_name: p.course_name || 'Unknown Course',
          amount: p.amount || 0,
          currency: 'USD',
          payment_method: String(p.method || 'other').toLowerCase(),
          status: String(p.status || 'pending').toLowerCase(),
          transaction_id: p.transaction_id,
          payment_date: p.paid_at || p.created_at,
          due_date: p.due_date || p.created_at,
          created_at: p.created_at,
          receipt_sent: p.status === 'paid',
          invoice_number: p.id ? `INV-${String(p.id).slice(0, 8).toUpperCase()}` : `INV-${Date.now()}`,
          notes: p.notes
        }));
        
        setPayments(transformedPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        // Fallback to mock data if API fails
        setPayments(mockPayments);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter and search logic
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.payment_method === methodFilter;
    const matchesDateRange =
      (!dateRange.start || new Date(payment.created_at) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(payment.created_at) <= new Date(dateRange.end));
    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    totalRevenue: payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    failedAmount: payments.filter((p) => p.status === "failed").reduce((sum, p) => sum + p.amount, 0),
    refundedAmount: payments.filter((p) => p.status === "refunded").reduce((sum, p) => sum + p.amount, 0),
    totalPayments: payments.length,
    paidCount: payments.filter((p) => p.status === "paid").length,
    pendingCount: payments.filter((p) => p.status === "pending").length,
    failedCount: payments.filter((p) => p.status === "failed").length
  };

  // Modal handlers
  const openDetailModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedPayment(null);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Invoice Number",
      "Student Name",
      "Student Email",
      "Course",
      "Amount",
      "Currency",
      "Payment Method",
      "Status",
      "Transaction ID",
      "Payment Date",
      "Due Date",
      "Receipt Sent"
    ];

    const rows = filteredPayments.map((p) => [
      p.invoice_number,
      p.student_name,
      p.student_email,
      p.course_name,
      p.amount,
      p.currency,
      p.payment_method,
      p.status,
      p.transaction_id || "N/A",
      p.payment_date ? formatDate(p.payment_date) : "N/A",
      formatDate(p.due_date),
      p.receipt_sent ? "Yes" : "No"
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      paid: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      refunded: "bg-purple-100 text-purple-700 border-purple-200"
    };
    const icons: Record<string, React.ReactNode> = {
      paid: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
      refunded: <RefreshCw className="w-3 h-3" />
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}
      >
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment method badge
  const MethodBadge = ({ method }: { method: string }) => {
    const labels: Record<string, string> = {
      stripe: "Stripe",
      paypal: "PayPal",
      bank_transfer: "Bank Transfer",
      other: "Other"
    };
    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
        {labels[method] || method}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar userType="admin" />

      <main className="lg:ml-64 p-4 lg:p-8">
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
                {t("admin.payments.title") || "Payments Management"}
              </h1>
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.payments.subtitle") || "Track and manage all payment transactions"}
              </p>
            </div>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className={isRTL ? "arabic-text" : ""}>{t("admin.payments.exportCSV") || "Export CSV"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: t("admin.payments.totalRevenue") || "Total Revenue",
              value: `$${stats.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: "#10B981",
              trend: "+18%",
              trendUp: true
            },
            {
              label: t("admin.payments.pending") || "Pending",
              value: `$${stats.pendingAmount.toLocaleString()}`,
              icon: Clock,
              color: "#F59E0B",
              count: stats.pendingCount
            },
            {
              label: t("admin.payments.failed") || "Failed",
              value: `$${stats.failedAmount.toLocaleString()}`,
              icon: XCircle,
              color: "#EF4444",
              count: stats.failedCount
            },
            {
              label: t("admin.payments.refunded") || "Refunded",
              value: `$${stats.refundedAmount.toLocaleString()}`,
              icon: RefreshCw,
              color: "#8B5CF6"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card p-4 rounded-xl border border-[var(--border)]"
            >
              <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <p className={`text-[var(--text-muted)] text-sm ${isRTL ? "arabic-text" : ""}`}>{stat.label}</p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className={`flex items-end justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                )}
                {stat.count !== undefined && (
                  <span className="text-xs text-[var(--text-muted)]">{stat.count} payments</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Overview Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card p-6 rounded-xl border border-[var(--border)] mb-8"
        >
          <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className={`text-lg font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.payments.revenueOverview") || "Revenue Overview"}
            </h2>
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button className="px-3 py-1 text-sm bg-[var(--primary)] text-white rounded-lg">Monthly</button>
              <button className="px-3 py-1 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)]">
                Weekly
              </button>
              <button className="px-3 py-1 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)]">
                Yearly
              </button>
            </div>
          </div>
          {/* Chart placeholder */}
          <div className="h-64 flex items-center justify-center border border-dashed border-[var(--border)] rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-2" />
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.payments.chartPlaceholder") || "Revenue chart will be displayed here"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card p-4 rounded-xl border border-[var(--border)] mb-6"
        >
          <div className={`flex flex-col lg:flex-row gap-4 ${isRTL ? "lg:flex-row-reverse" : ""}`}>
            <div className="flex-1 relative">
              <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]`} />
              <input
                type="text"
                placeholder={t("admin.payments.searchPlaceholder") || "Search by name, email, invoice, or transaction ID..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? "pr-10 pl-4 arabic-text" : "pl-10 pr-4"} py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]`}
              />
            </div>
            <div className={`flex flex-wrap gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.payments.allStatus") || "All Status"}</option>
                <option value="paid">{t("admin.payments.paid") || "Paid"}</option>
                <option value="pending">{t("admin.payments.pending") || "Pending"}</option>
                <option value="failed">{t("admin.payments.failed") || "Failed"}</option>
                <option value="refunded">{t("admin.payments.refunded") || "Refunded"}</option>
              </select>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className={`px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}
              >
                <option value="all">{t("admin.payments.allMethods") || "All Methods"}</option>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--text-primary)]"
                placeholder="End Date"
              />
            </div>
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-xl border border-[var(--border)] overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                {t("admin.loading") || "Loading..."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--background-green)]">
                    <tr>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.payments.table.invoice") || "Invoice"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.payments.table.student") || "Student"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.payments.table.course") || "Course"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.payments.table.amount") || "Amount"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.payments.table.method") || "Method"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.payments.table.status") || "Status"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.payments.table.date") || "Date"}
                      </th>
                      <th className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"} text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`}>
                        {t("admin.payments.table.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {paginatedPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[var(--background-green)] transition-colors">
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <span className={`font-mono text-sm text-[var(--primary)] ${isRTL ? "arabic-text" : ""}`}>
                            {payment.invoice_number}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-semibold">
                              {payment.student_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <p className={`font-medium text-[var(--text-primary)] text-sm ${isRTL ? "arabic-text" : ""}`}>{payment.student_name}</p>
                              <p className="text-xs text-[var(--text-muted)]">{payment.student_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <span className={`text-sm text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>
                            {payment.course_name}
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <span className="font-semibold text-[var(--text-primary)]">
                            ${payment.amount}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] ml-1">{payment.currency}</span>
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <MethodBadge method={payment.payment_method} />
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {payment.payment_date ? formatDate(payment.payment_date) : formatDate(payment.created_at)}
                          </p>
                          {payment.status === "pending" && (
                            <p className={`text-xs text-yellow-600 ${isRTL ? "arabic-text" : ""}`}>
                              Due: {formatDate(payment.due_date)}
                            </p>
                          )}
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <button
                              onClick={() => openDetailModal(payment)}
                              className="p-2 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-[var(--primary)]" />
                            </button>
                            {payment.status === "paid" && (
                              <>
                                <button
                                  className="p-2 hover:bg-[var(--background-green)] rounded-lg transition-colors"
                                  title="Print Receipt"
                                >
                                  <Printer className="w-4 h-4 text-[var(--text-muted)]" />
                                </button>
                                <button
                                  className="p-2 hover:bg-[var(--background-green)] rounded-lg transition-colors"
                                  title="Send Receipt"
                                >
                                  <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`flex items-center justify-between px-6 py-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                  <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
                    {t("admin.showing") || "Showing"} {(currentPage - 1) * itemsPerPage + 1} {t("admin.to") || "to"}{" "}
                    {Math.min(currentPage * itemsPerPage, filteredPayments.length)} {t("admin.of") || "of"} {filteredPayments.length}{" "}
                    {t("admin.payments.results") || "payments"}
                  </p>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Empty State */}
        {!loading && filteredPayments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CreditCard className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className={`text-xl font-semibold text-[var(--text-primary)] mb-2 ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.payments.noResults") || "No payments found"}
            </h3>
            <p className={`text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>
              {t("admin.payments.tryDifferent") || "Try adjusting your search or filter criteria"}
            </p>
          </motion.div>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Receipt className="w-6 h-6 text-[var(--primary)]" />
                  <h2 className={`text-xl font-bold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                    {t("admin.payments.paymentDetails") || "Payment Details"}
                  </h2>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-[var(--background-green)] rounded-lg">
                  <XCircle className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Invoice Header */}
                <div className={`flex items-center justify-between p-4 bg-[var(--background-green)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className={`text-sm text-[var(--text-muted)] ${isRTL ? "arabic-text" : ""}`}>{t("admin.payments.invoiceNumber") || "Invoice Number"}</p>
                    <p className={`font-mono text-xl font-bold text-[var(--primary)] ${isRTL ? "arabic-text" : ""}`}>
                      {selectedPayment.invoice_number}
                    </p>
                  </div>
                  <StatusBadge status={selectedPayment.status} />
                </div>

                {/* Amount */}
                <div className="text-center py-6 border border-[var(--border)] rounded-xl">
                  <p className={`text-sm text-[var(--text-muted)] mb-2 ${isRTL ? "arabic-text" : ""}`}>{t("admin.payments.amount") || "Amount"}</p>
                  <p className="text-4xl font-bold text-[var(--text-primary)]">
                    ${selectedPayment.amount}
                    <span className="text-lg text-[var(--text-muted)] ml-1">{selectedPayment.currency}</span>
                  </p>
                </div>

                {/* Student Information */}
                <div className="p-4 border border-[var(--border)] rounded-xl">
                  <h4 className={`text-sm font-semibold text-[var(--text-muted)] mb-3 ${isRTL ? "arabic-text" : ""}`}>
                    {t("admin.payments.studentInfo") || "Student Information"}
                  </h4>
                  <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                      {selectedPayment.student_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className={`font-semibold text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                        {selectedPayment.student_name}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">{selectedPayment.student_email}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--background-green)] rounded-xl">
                    <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.payments.course") || "Course"}</p>
                    <p className={`font-medium text-[var(--text-primary)] ${isRTL ? "arabic-text" : ""}`}>
                      {selectedPayment.course_name}
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--background-green)] rounded-xl">
                    <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.payments.paymentMethod") || "Payment Method"}</p>
                    <p className="font-medium text-[var(--text-primary)]">
                      {paymentMethods.find((m) => m.value === selectedPayment.payment_method)?.label || selectedPayment.payment_method}
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--background-green)] rounded-xl">
                    <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.payments.dueDate") || "Due Date"}</p>
                    <p className="font-medium text-[var(--text-primary)]">{formatDate(selectedPayment.due_date)}</p>
                  </div>
                  <div className="p-4 bg-[var(--background-green)] rounded-xl">
                    <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.payments.paymentDate") || "Payment Date"}</p>
                    <p className="font-medium text-[var(--text-primary)]">
                      {selectedPayment.payment_date ? formatDateTime(selectedPayment.payment_date) : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Transaction ID */}
                {selectedPayment.transaction_id && (
                  <div className="p-4 border border-[var(--border)] rounded-xl">
                    <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.payments.transactionId") || "Transaction ID"}</p>
                    <p className="font-mono text-sm text-[var(--text-primary)]">{selectedPayment.transaction_id}</p>
                  </div>
                )}

                {/* Notes */}
                {selectedPayment.notes && (
                  <div className="p-4 border border-[var(--border)] rounded-xl">
                    <p className={`text-xs text-[var(--text-muted)] mb-1 ${isRTL ? "arabic-text" : ""}`}>{t("admin.payments.notes") || "Notes"}</p>
                    <p className={`text-[var(--text-secondary)] ${isRTL ? "arabic-text" : ""}`}>{selectedPayment.notes}</p>
                  </div>
                )}

                {/* Receipt Status */}
                <div className={`flex items-center justify-between p-4 border border-[var(--border)] rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    {selectedPayment.receipt_sent ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className={`text-sm ${isRTL ? "arabic-text" : ""}`}>
                      {selectedPayment.receipt_sent
                        ? t("admin.payments.receiptSent") || "Receipt sent to student"
                        : t("admin.payments.receiptNotSent") || "Receipt not sent yet"}
                    </span>
                  </div>
                  {selectedPayment.status === "paid" && (
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors text-sm">
                      <Mail className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.payments.sendReceipt") || "Send Receipt"}</span>
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-3 pt-4 border-t border-[var(--border)] ${isRTL ? "flex-row-reverse" : ""}`}>
                  {selectedPayment.status === "paid" && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors">
                      <Printer className="w-4 h-4" />
                      <span className={isRTL ? "arabic-text" : ""}>{t("admin.payments.printReceipt") || "Print Receipt"}</span>
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-green)] transition-colors"
                  >
                    <span className={isRTL ? "arabic-text" : ""}>{t("admin.close") || "Close"}</span>
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
