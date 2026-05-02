"use client";

import { useState } from "react";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AdminCard,
  AdminTable,
  SearchInput,
  FilterSelect,
  Pagination,
  StatusBadge,
  ActionButtons,
  PageHeader,
  EmptyState,
  LoadingSkeleton,
  AdminModal,
} from "@/components/admin";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { usePaginatedData } from "@/hooks";

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

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const methodOptions = [
  { value: "", label: "All Methods" },
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

export default function PaymentsPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <PaymentsContent />
      </AdminLayout>
    </AdminRoute>
  );
}

function PaymentsContent() {
  const {
    data: payments,
    total,
    page,
    limit,
    search,
    loading,
    totalPages,
    setPage,
    setSearch,
  } = usePaginatedData<Payment>('payments', { pageSize: 10 });

  const [viewPayment, setViewPayment] = useState<Payment | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesMethod = methodFilter ? p.payment_method === methodFilter : true;
    return matchesStatus && matchesMethod;
  });

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    {
      key: "invoice",
      header: "Invoice",
      render: (p: Payment) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
            <Receipt className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              #{p.invoice_number}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {p.course_name}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "student",
      header: "Student",
      render: (p: Payment) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{p.student_name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{p.student_email}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (p: Payment) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {p.currency} {p.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p: Payment) => <StatusBadge status={p.status} />,
    },
    {
      key: "method",
      header: "Method",
      render: (p: Payment) => (
        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
          {p.payment_method.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p: Payment) => (
        <ActionButtons onView={() => setViewPayment(p)} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Payments"
        description="Manage payments and transactions"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AdminCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search payments..."
            className="sm:w-80"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Filter by status"
            className="sm:w-40"
          />
          <FilterSelect
            value={methodFilter}
            onChange={setMethodFilter}
            options={methodOptions}
            placeholder="Filter by method"
            className="sm:w-40"
          />
        </div>

        {loading ? (
          <LoadingSkeleton rows={5} columns={6} />
        ) : filteredPayments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments found"
            description={search || statusFilter || methodFilter ? "Try adjusting filters" : "No payments yet"}
          />
        ) : (
          <AdminTable
            data={filteredPayments}
            columns={columns}
            keyExtractor={(p) => p.id}
          />
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          className="mt-6"
        />
      </AdminCard>

      {/* View Modal */}
      <AdminModal
        isOpen={!!viewPayment}
        onClose={() => setViewPayment(null)}
        title="Payment Details"
        size="md"
      >
        {viewPayment && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                <Receipt className="w-8 h-8 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">#{viewPayment.invoice_number}</h3>
                <StatusBadge status={viewPayment.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium">{viewPayment.student_name}</p>
                <p className="text-sm text-gray-400">{viewPayment.student_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-medium">{viewPayment.course_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold">
                  {viewPayment.currency} {viewPayment.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="font-medium capitalize">{viewPayment.payment_method.replace("_", " ")}</p>
              </div>
              {viewPayment.transaction_id && (
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium font-mono text-sm">{viewPayment.transaction_id}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}