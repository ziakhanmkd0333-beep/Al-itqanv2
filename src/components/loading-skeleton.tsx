"use client";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-4 lg:p-8">
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-[var(--border)] animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-300 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card p-4 rounded-xl border border-[var(--border)] animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-12 bg-gray-300 rounded" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-[var(--border)] p-6 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
          <div className="h-48 bg-gray-100 rounded" />
        </div>
        <div className="bg-card rounded-2xl border border-[var(--border)] p-6 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
          <div className="h-32 w-32 mx-auto rounded-full bg-gray-100" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse">
            <div className="p-6 border-b border-[var(--border)]">
              <div className="h-6 w-40 bg-gray-200 rounded" />
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card p-4 rounded-xl border border-[var(--border)] animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card rounded-xl border border-[var(--border)] overflow-hidden animate-pulse">
      <div className="p-4 border-b border-[var(--border)] flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-24 bg-gray-200 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-[var(--border)] last:border-0 flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1 h-4 bg-gray-200 rounded" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-6 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
